import { toutesLesPersonnes, personneAffichee, nomAffiche } from "./data";
import type { Personne } from "./schema";

export interface NoeudArbre {
  id: string;
  x: number;
  y: number;
  generation: number;
  nom: string;
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
  noeuds: NoeudArbre[];
  liens: LienArbre[];
  largeur: number;
  hauteur: number;
}

const LARGEUR_BOITE = 180;
const ESPACE_X = 40;
const HAUTEUR_LIGNE = 150;

function voisins(p: Personne): string[] {
  return [
    ...(p.pereId ? [p.pereId] : []),
    ...(p.mereId ? [p.mereId] : []),
    ...(p.conjointIds ?? []),
    ...(p.enfantIds ?? []),
  ];
}

export function calculerComposantes(): ComposanteArbre[] {
  const personnes = toutesLesPersonnes();
  const parId = new Map(personnes.map((p) => [p.id, p]));

  // 1. Composantes connexes (union-find simple par parcours en largeur).
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
    const generation = new Map<string, number>();

    // 2. Génération par filiation (enfant = parent + 1), plusieurs passes
    // pour propager aussi via les conjoints.
    for (const p of groupe) generation.set(p.id, 0);
    for (let passe = 0; passe < groupe.length + 2; passe++) {
      let change = false;
      for (const p of groupe) {
        const genActuelle = generation.get(p.id)!;
        for (const parentId of [p.pereId, p.mereId]) {
          if (parentId && idsGroupe.has(parentId)) {
            const genVoulue = generation.get(parentId)! + 1;
            if (genVoulue > genActuelle) {
              generation.set(p.id, genVoulue);
              change = true;
            }
          }
        }
        for (const cId of p.conjointIds ?? []) {
          if (idsGroupe.has(cId)) {
            const genConjoint = generation.get(cId)!;
            const genMax = Math.max(genActuelle, genConjoint, generation.get(p.id)!);
            if (generation.get(cId)! < genMax) {
              generation.set(cId, genMax);
              change = true;
            }
            if (generation.get(p.id)! < genMax) {
              generation.set(p.id, genMax);
              change = true;
            }
          }
        }
      }
      if (!change) break;
    }

    // 3. Regroupement par génération, tri stable, positionnement en x.
    const parGeneration = new Map<number, Personne[]>();
    for (const p of groupe) {
      const g = generation.get(p.id)!;
      if (!parGeneration.has(g)) parGeneration.set(g, []);
      parGeneration.get(g)!.push(p);
    }
    for (const liste of parGeneration.values()) {
      liste.sort((a, b) => {
        // Rapproche les couples : trie par id du conjoint le plus "petit".
        return a.id.localeCompare(b.id);
      });
    }

    const noeuds: NoeudArbre[] = [];
    let largeurMax = 0;
    for (const [g, liste] of [...parGeneration.entries()].sort((a, b) => a[0] - b[0])) {
      liste.forEach((p, index) => {
        const affichee = personneAffichee(p);
        noeuds.push({
          id: p.id,
          x: index * (LARGEUR_BOITE + ESPACE_X),
          y: g * HAUTEUR_LIGNE,
          generation: g,
          nom: nomAffiche(p),
          statut: p.statut,
          branche: p.branche,
          masquee: affichee.masquee,
        });
      });
      largeurMax = Math.max(largeurMax, liste.length * (LARGEUR_BOITE + ESPACE_X));
    }

    const liens: LienArbre[] = [];
    const dejaUnion = new Set<string>();
    for (const p of groupe) {
      for (const eId of p.enfantIds ?? []) {
        if (idsGroupe.has(eId)) liens.push({ type: "filiation", de: p.id, a: eId });
      }
      for (const cId of p.conjointIds ?? []) {
        if (idsGroupe.has(cId)) {
          const cle = [p.id, cId].sort().join("|");
          if (!dejaUnion.has(cle)) {
            dejaUnion.add(cle);
            liens.push({ type: "union", de: p.id, a: cId });
          }
        }
      }
    }

    const generations = [...parGeneration.keys()];
    composantes.push({
      id: groupe[0].id,
      noeuds,
      liens,
      largeur: largeurMax,
      hauteur: (Math.max(...generations) - Math.min(...generations) + 1) * HAUTEUR_LIGNE,
    });
  }

  // Composantes les plus grandes en premier.
  return composantes.sort((a, b) => b.noeuds.length - a.noeuds.length);
}

export const LARGEUR_BOITE_ARBRE = LARGEUR_BOITE;
export const HAUTEUR_LIGNE_ARBRE = HAUTEUR_LIGNE;
