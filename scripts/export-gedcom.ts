import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  PersonneSchema,
  SourceSchema,
  type Personne,
  type Source,
  type Evenement,
} from "../src/lib/schema";
import { versDateGedcom, STATUT_VERS_QUAY, ligneAvecConc } from "./gedcom-lib";

const RACINE = new URL("../src/data/", import.meta.url).pathname;
const SORTIE = process.argv[2] ?? join(new URL("../", import.meta.url).pathname, "export.ged");

function chargerJson(chemin: string): unknown {
  return JSON.parse(readFileSync(chemin, "utf-8"));
}

const personnes: Personne[] = readdirSync(join(RACINE, "personnes"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => PersonneSchema.parse(chargerJson(join(RACINE, "personnes", f))));

const sources: Source[] = readdirSync(join(RACINE, "sources"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => SourceSchema.parse(chargerJson(join(RACINE, "sources", f))));

const lieux = new Map<string, { nom: string; pays: string }>(
  (chargerJson(join(RACINE, "lieux.json")) as { id: string; nom: string; pays: string }[]).map((l) => [
    l.id,
    { nom: l.nom, pays: l.pays },
  ])
);

function lieuTexte(lieuId: string | null | undefined): string | null {
  if (!lieuId) return null;
  const l = lieux.get(lieuId);
  return l ? `${l.nom}, ${l.pays}` : null;
}

// --- Pointeurs GEDCOM ------------------------------------------------------
const pointeurIndi = new Map<string, string>();
personnes.forEach((p, i) => pointeurIndi.set(p.id, `I${i + 1}`));

const pointeurSource = new Map<string, string>();
sources.forEach((s, i) => pointeurSource.set(s.id, `S${i + 1}`));

// Familles : une par paire de conjoints connue, plus une par couple parental
// (pereId, mereId) qui n'aurait pas de conjointIds déclaré.
interface Famille {
  id: string;
  epouxId: string | null;
  epouseId: string | null;
  enfantIds: Set<string>;
}
const familles = new Map<string, Famille>();
const parId = new Map(personnes.map((p) => [p.id, p]));

function cleFamille(a: string | null, b: string | null): string {
  return [a ?? "_", b ?? "_"].sort().join("|");
}

function familleDe(pereId: string | null, mereId: string | null): Famille {
  const cle = cleFamille(pereId, mereId);
  let f = familles.get(cle);
  if (!f) {
    f = { id: `F${familles.size + 1}`, epouxId: pereId, epouseId: mereId, enfantIds: new Set() };
    familles.set(cle, f);
  }
  return f;
}

for (const p of personnes) {
  for (const cId of p.conjointIds ?? []) {
    const conjoint = parId.get(cId);
    if (!conjoint) continue;
    const epouxId = p.sexe === "M" ? p.id : conjoint.sexe === "M" ? conjoint.id : p.id;
    const epouseId = p.sexe === "F" ? p.id : conjoint.sexe === "F" ? conjoint.id : conjoint.id;
    familleDe(epouxId, epouseId);
  }
  if (p.pereId || p.mereId) {
    const f = familleDe(p.pereId ?? null, p.mereId ?? null);
    f.enfantIds.add(p.id);
  }
}

const pointeurFamille = new Map<string, string>();
for (const f of familles.values()) pointeurFamille.set(cleFamille(f.epouxId, f.epouseId), f.id);

function famillesCommeParent(personneId: string): Famille[] {
  return [...familles.values()].filter((f) => f.epouxId === personneId || f.epouseId === personneId);
}
function familleCommeEnfant(personneId: string): Famille | undefined {
  return [...familles.values()].find((f) => f.enfantIds.has(personneId));
}

// --- Génération -------------------------------------------------------------
const lignes: string[] = [];
const ecrire = (niveau: number, tag: string, valeur = "") => {
  if (valeur) lignes.push(...ligneAvecConc(niveau, tag, valeur));
  else lignes.push(`${niveau} ${tag}`);
};

ecrire(0, "HEAD");
ecrire(1, "SOUR", "GenealogieArrouasseAmsellem");
ecrire(1, "GEDC");
ecrire(2, "VERS", "5.5.1");
ecrire(2, "FORM", "LINEAGE-LINKED");
ecrire(1, "CHAR", "UTF-8");
ecrire(1, "SUBM", "@SUB1@");
lignes.push("0 @SUB1@ SUBM");
ecrire(1, "NAME", "Site de généalogie Arrouasse / Amsellem");

function ecrireEvenement(tag: "BIRT" | "DEAT" | "MARR", ev: Evenement) {
  ecrire(1, tag);
  if (ev.date) ecrire(2, "DATE", versDateGedcom(ev.date));
  else if (ev.dateTexte) ecrire(2, "DATE", ev.dateTexte);
  const lieu = lieuTexte(ev.lieuId);
  if (lieu) ecrire(2, "PLAC", lieu);
  if (ev.notes) ecrire(2, "NOTE", ev.notes);
  for (const sid of ev.sourceIds) {
    const ptr = pointeurSource.get(sid);
    if (!ptr) continue;
    ecrire(2, "SOUR", `@${ptr}@`);
    const quay = STATUT_VERS_QUAY[ev.statut];
    if (quay !== null) ecrire(3, "QUAY", String(quay));
  }
}

for (const p of personnes) {
  const ptr = pointeurIndi.get(p.id)!;
  lignes.push(`0 @${ptr}@ INDI`);
  const nomComplet = `${p.prenoms.join(" ")} /${p.nom}/`;
  ecrire(1, "NAME", nomComplet);
  if (p.prenomUsuel) ecrire(1, "NICK", p.prenomUsuel);
  ecrire(1, "SEX", p.sexe);
  if (p.naissance) ecrireEvenement("BIRT", p.naissance);
  if (p.deces) ecrireEvenement("DEAT", p.deces);
  for (const prof of p.professions ?? []) {
    ecrire(1, "OCCU", prof.intitule);
    if (prof.periode) ecrire(2, "DATE", prof.periode);
    for (const sid of prof.sourceIds) {
      const sourcePtr = pointeurSource.get(sid);
      if (sourcePtr) ecrire(2, "SOUR", `@${sourcePtr}@`);
    }
  }
  const famC = familleCommeEnfant(p.id);
  if (famC) ecrire(1, "FAMC", `@${famC.id}@`);
  for (const fam of famillesCommeParent(p.id)) ecrire(1, "FAMS", `@${fam.id}@`);
  if (p.notes) ecrire(1, "NOTE", p.notes);
  for (const sid of p.sourceIds) {
    const sourcePtr = pointeurSource.get(sid);
    if (!sourcePtr) continue;
    ecrire(1, "SOUR", `@${sourcePtr}@`);
    const quay = STATUT_VERS_QUAY[p.statut];
    if (quay !== null) ecrire(2, "QUAY", String(quay));
  }
  ecrire(1, "_ID", p.id);
  ecrire(1, "_STATUT", p.statut);
  ecrire(1, "_BRANCHE", p.branche);
  ecrire(1, "_VIVANT", p.vivant ? "Y" : "N");
  if (p.prenomHebraique) ecrire(1, "_PRENOM_HEBRAIQUE", p.prenomHebraique);
  if (p.variantesGraphiques && p.variantesGraphiques.length > 0) {
    ecrire(1, "_VARIANTES", p.variantesGraphiques.join(", "));
  }
}

for (const f of familles.values()) {
  lignes.push(`0 @${f.id}@ FAM`);
  if (f.epouxId && pointeurIndi.has(f.epouxId)) ecrire(1, "HUSB", `@${pointeurIndi.get(f.epouxId)}@`);
  if (f.epouseId && pointeurIndi.has(f.epouseId)) ecrire(1, "WIFE", `@${pointeurIndi.get(f.epouseId)}@`);
  for (const eId of f.enfantIds) {
    if (pointeurIndi.has(eId)) ecrire(1, "CHIL", `@${pointeurIndi.get(eId)}@`);
  }
  // Mariage : cherché sur l'un ou l'autre des conjoints.
  const epoux = f.epouxId ? parId.get(f.epouxId) : undefined;
  const epouse = f.epouseId ? parId.get(f.epouseId) : undefined;
  const mariage = (epoux?.mariages ?? []).find((m) =>
    (epoux?.conjointIds ?? []).includes(f.epouseId ?? "")
  ) ?? (epouse?.mariages ?? []).find((m) => (epouse?.conjointIds ?? []).includes(f.epouxId ?? ""));
  if (mariage) ecrireEvenement("MARR", mariage);
}

for (const s of sources) {
  const ptr = pointeurSource.get(s.id)!;
  lignes.push(`0 @${ptr}@ SOUR`);
  ecrire(1, "TITL", s.titre);
  if (s.depot) ecrire(1, "REPO", s.depot);
  if (s.date) ecrire(1, "DATA");
  if (s.date) ecrire(2, "DATE", s.date);
  if (s.lien) ecrire(1, "PUBL", s.lien);
  if (s.notes) ecrire(1, "NOTE", s.notes);
  ecrire(1, "_TYPE", s.type);
  if (s.cote) ecrire(1, "_COTE", s.cote);
  ecrire(1, "_ID", s.id);
}

ecrire(0, "TRLR");

writeFileSync(SORTIE, lignes.join("\n") + "\n", "utf-8");
console.log(`GEDCOM exporté : ${SORTIE} (${personnes.length} individus, ${familles.size} familles, ${sources.length} sources).`);
