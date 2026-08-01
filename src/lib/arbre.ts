import { toutesLesPersonnes, personneAffichee, nomAffiche } from "./data";
import type { Personne } from "./schema";

export interface NoeudArbre {
  id: string;
  x: number;
  y: number;
  generation: number;
  nom: string;
  annees: string | null;
  statut: Personne["statut"];
  branche: Personne["branche"];
  masquee: boolean;
}

export interface LienArbre {
  type: "filiation" | "union";
  de: string;
  a: string;
}

export interface ComposanteArbre {
  id: string;
  /** Vrai pour le groupe qui contient la ligne directe (Jean Arrouasse). */
  principale: boolean;
  noeuds: NoeudArbre[];
  liens: LienArbre[];
  minX: number;
  minY: number;
  largeur: number;
  hauteur: number;
}

export const LARGEUR_BOITE = 172;
export const HAUTEUR_BOITE = 64;
const ESPACE_FRATRIE = 26;
const ESPACE_COUPLE = 38;
const HAUTEUR_LIGNE = 132;

/** Personne autour de laquelle s'organise la ligne directe du site. */
const ANCRE_LIGNE_DIRECTE = "arrouasse-jean";

function voisins(p: Personne): string[] {
  return [
    ...(p.pereId ? [p.pereId] : []),
    ...(p.mereId ? [p.mereId] : []),
    ...(p.conjointIds ?? []),
    ...(p.enfantIds ?? []),
  ];
}

function anneesDe(p: Personne): string | null {
  const naissance = p.naissance?.date?.slice(0, 4) ?? null;
  const deces = p.deces?.date?.slice(0, 4) ?? null;
  if (naissance && deces) return `${naissance} – ${deces}`;
  if (naissance) return naissance;
  if (deces) return `† ${deces}`;
  return null;
}

/**
 * Une « unité » est ce qui s'affiche sur une même ligne de l'arbre : un
 * couple (deux boîtes reliées par le khatem) ou une personne seule. C'est
 * l'unité de placement horizontal, comme dans un arbre généalogique classique.
 */
interface Unite {
  cle: string;
  ids: string[];
  generation: number;
  enfants: string[];
  x: number;
}

function largeurUnite(u: Unite): number {
  return u.ids.length === 2 ? LARGEUR_BOITE * 2 + ESPACE_COUPLE : LARGEUR_BOITE;
}

export function calculerComposantes(): ComposanteArbre[] {
  const personnes = toutesLesPersonnes();
  const parId = new Map(personnes.map((p) => [p.id, p]));

  // 1. Composantes connexes : les sous-ensembles de personnes reliées entre
  // elles. Tant qu'un rattachement n'est pas prouvé, elles restent séparées.
  const visites = new Set<string>();
  const groupes: Personne[][] = [];
  for (const p of personnes) {
    if (visites.has(p.id)) continue;
    const groupe: Personne[] = [];
    const file = [p.id];
    visites.add(p.id);
    while (file.length > 0) {
      const id = file.shift()!;
      const personne = parId.get(id);
      if (!personne) continue;
      groupe.push(personne);
      for (const vId of voisins(personne)) {
        if (!visites.has(vId) && parId.has(vId)) {
          visites.add(vId);
          file.push(vId);
        }
      }
    }
    groupes.push(groupe);
  }

  const composantes: ComposanteArbre[] = [];

  for (const groupe of groupes) {
    const idsGroupe = new Set(groupe.map((p) => p.id));

    // 2. Génération de chacun : enfant = parent + 1, propagée aussi entre
    // conjoints pour qu'un couple soit toujours sur la même ligne.
    const generation = new Map<string, number>();
    for (const p of groupe) generation.set(p.id, 0);
    for (let passe = 0; passe < groupe.length + 2; passe++) {
      let change = false;
      for (const p of groupe) {
        for (const parentId of [p.pereId, p.mereId]) {
          if (parentId && idsGroupe.has(parentId)) {
            const voulue = generation.get(parentId)! + 1;
            if (voulue > generation.get(p.id)!) {
              generation.set(p.id, voulue);
              change = true;
            }
          }
        }
        for (const cId of p.conjointIds ?? []) {
          if (!idsGroupe.has(cId)) continue;
          const max = Math.max(generation.get(p.id)!, generation.get(cId)!);
          if (generation.get(cId)! < max) {
            generation.set(cId, max);
            change = true;
          }
          if (generation.get(p.id)! < max) {
            generation.set(p.id, max);
            change = true;
          }
        }
      }
      if (!change) break;
    }

    // 3. Constitution des unités (couples et personnes seules).
    const uniteParCle = new Map<string, Unite>();
    const uniteParPersonne = new Map<string, Unite>();
    for (const p of groupe) {
      if (uniteParPersonne.has(p.id)) continue;
      const conjointId = (p.conjointIds ?? []).find(
        (c) => idsGroupe.has(c) && !uniteParPersonne.has(c)
      );
      // L'homme à gauche, comme dans la mise en page classique d'un arbre.
      let ids = conjointId ? [p.id, conjointId] : [p.id];
      if (ids.length === 2 && parId.get(ids[0])!.sexe === "F" && parId.get(ids[1])!.sexe === "M") {
        ids = [ids[1], ids[0]];
      }
      const enfants = [
        ...new Set(
          ids.flatMap((id) => (parId.get(id)!.enfantIds ?? []).filter((e) => idsGroupe.has(e)))
        ),
      ];
      const unite: Unite = {
        cle: ids.join("+"),
        ids,
        generation: Math.max(...ids.map((id) => generation.get(id)!)),
        enfants,
        x: 0,
      };
      uniteParCle.set(unite.cle, unite);
      for (const id of ids) uniteParPersonne.set(id, unite);
    }

    // 4. Placement horizontal : chaque parent est centré au-dessus de ses
    // enfants, les fratries se suivent de gauche à droite. C'est ce qui
    // donne la silhouette attendue d'un arbre généalogique.
    const placees = new Set<string>();

    function unitesEnfantsDe(u: Unite): Unite[] {
      const vues = new Set<string>();
      const resultat: Unite[] = [];
      for (const enfantId of u.enfants) {
        const ue = uniteParPersonne.get(enfantId);
        if (!ue || vues.has(ue.cle) || placees.has(ue.cle)) continue;
        vues.add(ue.cle);
        resultat.push(ue);
      }
      return resultat;
    }

    function decaler(u: Unite, dx: number, vues = new Set<string>()) {
      if (vues.has(u.cle)) return;
      vues.add(u.cle);
      u.x += dx;
      for (const enfantId of u.enfants) {
        const ue = uniteParPersonne.get(enfantId);
        if (ue) decaler(ue, dx, vues);
      }
    }

    /** Place l'unité et sa descendance à partir de xDebut ; renvoie la place occupée. */
    function placer(u: Unite, xDebut: number): number {
      placees.add(u.cle);
      const enfants = unitesEnfantsDe(u);
      const lu = largeurUnite(u);

      if (enfants.length === 0) {
        u.x = xDebut;
        return lu + ESPACE_FRATRIE;
      }

      let curseur = xDebut;
      for (const e of enfants) curseur += placer(e, curseur);
      const largeurEnfants = curseur - xDebut - ESPACE_FRATRIE;

      if (largeurEnfants >= lu) {
        u.x = xDebut + (largeurEnfants - lu) / 2;
        return largeurEnfants + ESPACE_FRATRIE;
      }
      // Le couple est plus large que sa descendance : on recentre les enfants.
      const decalage = (lu - largeurEnfants) / 2;
      for (const e of enfants) decaler(e, decalage);
      u.x = xDebut;
      return lu + ESPACE_FRATRIE;
    }

    const racines = [...uniteParCle.values()].filter((u) =>
      u.ids.every((id) => {
        const p = parId.get(id)!;
        const aPere = p.pereId && idsGroupe.has(p.pereId);
        const aMere = p.mereId && idsGroupe.has(p.mereId);
        return !aPere && !aMere;
      })
    );
    const departs = racines.length > 0 ? racines : [[...uniteParCle.values()][0]];

    let curseurRacines = 0;
    for (const racine of departs) {
      if (placees.has(racine.cle)) continue;
      curseurRacines += placer(racine, curseurRacines);
    }
    // Filet de sécurité : toute unité non atteinte (donnée incohérente) est
    // ajoutée à droite plutôt que superposée à l'origine.
    for (const u of uniteParCle.values()) {
      if (!placees.has(u.cle)) curseurRacines += placer(u, curseurRacines);
    }

    // 5. Conversion des unités en noeuds affichables.
    const noeuds: NoeudArbre[] = [];
    for (const u of uniteParCle.values()) {
      u.ids.forEach((id, index) => {
        const p = parId.get(id)!;
        const affichee = personneAffichee(p);
        noeuds.push({
          id,
          x: u.x + index * (LARGEUR_BOITE + ESPACE_COUPLE),
          y: u.generation * HAUTEUR_LIGNE,
          generation: u.generation,
          nom: nomAffiche(p),
          annees: affichee.masquee ? null : anneesDe(p),
          statut: p.statut,
          branche: p.branche,
          masquee: affichee.masquee,
        });
      });
    }

    const liens: LienArbre[] = [];
    const dejaUnion = new Set<string>();
    for (const p of groupe) {
      for (const eId of p.enfantIds ?? []) {
        if (idsGroupe.has(eId)) liens.push({ type: "filiation", de: p.id, a: eId });
      }
      for (const cId of p.conjointIds ?? []) {
        if (!idsGroupe.has(cId)) continue;
        const cle = [p.id, cId].sort().join("|");
        if (dejaUnion.has(cle)) continue;
        dejaUnion.add(cle);
        liens.push({ type: "union", de: p.id, a: cId });
      }
    }

    const minX = Math.min(...noeuds.map((n) => n.x));
    const maxX = Math.max(...noeuds.map((n) => n.x + LARGEUR_BOITE));
    const minY = Math.min(...noeuds.map((n) => n.y));
    const maxY = Math.max(...noeuds.map((n) => n.y + HAUTEUR_BOITE));

    composantes.push({
      id: groupe[0].id,
      principale: idsGroupe.has(ANCRE_LIGNE_DIRECTE),
      noeuds,
      liens,
      minX,
      minY,
      largeur: maxX - minX,
      hauteur: maxY - minY,
    });
  }

  // La ligne directe d'abord, puis les groupes par taille décroissante.
  return composantes.sort((a, b) => {
    if (a.principale !== b.principale) return a.principale ? -1 : 1;
    return b.noeuds.length - a.noeuds.length;
  });
}

export const LARGEUR_BOITE_ARBRE = LARGEUR_BOITE;
export const HAUTEUR_BOITE_ARBRE = HAUTEUR_BOITE;
export const HAUTEUR_LIGNE_ARBRE = HAUTEUR_LIGNE;
