import type { Statut } from "../src/lib/schema";

export const MOIS_GEDCOM = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

/** "1885-01-04" -> "4 JAN 1885" ; "1885-01" -> "JAN 1885" ; "1885" -> "1885" */
export function versDateGedcom(date: string): string {
  const [annee, mois, jour] = date.split("-");
  if (jour && mois) return `${parseInt(jour, 10)} ${MOIS_GEDCOM[parseInt(mois, 10) - 1]} ${annee}`;
  if (mois) return `${MOIS_GEDCOM[parseInt(mois, 10) - 1]} ${annee}`;
  return annee;
}

/** "4 JAN 1885" -> "1885-01-04" ; "JAN 1885" -> "1885-01" ; "1885" -> "1885" */
export function depuisDateGedcom(gedcomDate: string): string | null {
  const nettoye = gedcomDate.trim().toUpperCase();
  const motsAvecJour = nettoye.match(/^(\d{1,2})\s+([A-Z]{3})\s+(\d{4})$/);
  if (motsAvecJour) {
    const jour = motsAvecJour[1].padStart(2, "0");
    const moisIdx = MOIS_GEDCOM.indexOf(motsAvecJour[2]);
    if (moisIdx === -1) return null;
    return `${motsAvecJour[3]}-${String(moisIdx + 1).padStart(2, "0")}-${jour}`;
  }
  const moisSeul = nettoye.match(/^([A-Z]{3})\s+(\d{4})$/);
  if (moisSeul) {
    const moisIdx = MOIS_GEDCOM.indexOf(moisSeul[1]);
    if (moisIdx === -1) return null;
    return `${moisSeul[2]}-${String(moisIdx + 1).padStart(2, "0")}`;
  }
  const anneeSeule = nettoye.match(/^\d{4}$/);
  if (anneeSeule) return nettoye;
  return null;
}

/** Statut ⇄ QUAY (0-3), la seule notion de confiance native à GEDCOM. */
export const STATUT_VERS_QUAY: Record<Statut, number | null> = {
  prouve: 3,
  temoignage: 1,
  hypothese: 0,
  inconnu: null,
};

export function quayVersStatut(quay: number | null | undefined, aSource: boolean): Statut {
  if (!aSource) return "inconnu";
  if (quay === 3 || quay === 2) return "prouve";
  if (quay === 0) return "hypothese";
  return "temoignage";
}

/** Découpe une ligne GEDCOM trop longue en CONC (>1 fois 248 car. par convention). */
export function ligneAvecConc(niveau: number, tag: string, valeur: string): string[] {
  const MAX = 200;
  if (valeur.length <= MAX) return [`${niveau} ${tag} ${valeur}`];
  const lignes = [`${niveau} ${tag} ${valeur.slice(0, MAX)}`];
  let reste = valeur.slice(MAX);
  while (reste.length > 0) {
    lignes.push(`${niveau + 1} CONC ${reste.slice(0, MAX)}`);
    reste = reste.slice(MAX);
  }
  return lignes;
}

export interface NoeudGedcom {
  niveau: number;
  tag: string;
  xref: string | null;
  valeur: string;
  enfants: NoeudGedcom[];
}

/** Parse le texte GEDCOM en une forêt de noeuds imbriqués par niveau. */
export function parserGedcom(texte: string): NoeudGedcom[] {
  const lignes = texte.split(/\r?\n/).filter((l) => l.trim() !== "");
  const racine: NoeudGedcom = { niveau: -1, tag: "ROOT", xref: null, valeur: "", enfants: [] };
  const pile: NoeudGedcom[] = [racine];

  for (const ligne of lignes) {
    const m = ligne.match(/^(\d+)\s+(@[^@]+@\s+)?([A-Za-z_][A-Za-z0-9_]*)\s?(.*)$/);
    if (!m) continue;
    const niveau = parseInt(m[1], 10);
    const xref = m[2] ? m[2].trim().replace(/@/g, "") : null;
    const tag = m[3];
    const valeur = m[4] ?? "";

    const noeud: NoeudGedcom = { niveau, tag, xref, valeur, enfants: [] };

    // CONC/CONT : accolent au texte du parent courant plutôt que créer un noeud.
    const parentPotentiel = pile[pile.length - 1];
    if ((tag === "CONC" || tag === "CONT") && parentPotentiel && parentPotentiel.niveau === niveau - 1) {
      parentPotentiel.valeur += (tag === "CONT" ? "\n" : "") + valeur;
      continue;
    }

    while (pile.length > 1 && pile[pile.length - 1].niveau >= niveau) pile.pop();
    pile[pile.length - 1].enfants.push(noeud);
    pile.push(noeud);
  }

  return racine.enfants;
}

export function trouverEnfant(noeud: NoeudGedcom, tag: string): NoeudGedcom | undefined {
  return noeud.enfants.find((e) => e.tag === tag);
}

export function trouverEnfants(noeud: NoeudGedcom, tag: string): NoeudGedcom[] {
  return noeud.enfants.filter((e) => e.tag === tag);
}
