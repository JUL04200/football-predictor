import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  parserGedcom,
  trouverEnfant,
  trouverEnfants,
  depuisDateGedcom,
  quayVersStatut,
  type NoeudGedcom,
} from "./gedcom-lib";
import type { Personne, Source, Evenement, Statut, Branche } from "../src/lib/schema";

const FICHIER = process.argv[2];
if (!FICHIER) {
  console.error("Usage : npm run import:gedcom -- chemin/vers/fichier.ged [dossier-de-sortie]");
  process.exit(1);
}
const DOSSIER_SORTIE = process.argv[3] ?? new URL("../src/data/", import.meta.url).pathname;

const texte = readFileSync(FICHIER, "utf-8");
const records = parserGedcom(texte);

const CHEMIN_LIEUX = new URL("../src/data/lieux.json", import.meta.url).pathname;
const lieuIdParTexte = new Map<string, string>();
if (existsSync(CHEMIN_LIEUX)) {
  const lieuxConnus = JSON.parse(readFileSync(CHEMIN_LIEUX, "utf-8")) as {
    id: string;
    nom: string;
    pays: string;
  }[];
  for (const l of lieuxConnus) lieuIdParTexte.set(`${l.nom}, ${l.pays}`, l.id);
}

function slugifier(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// --- Sources -----------------------------------------------------------
const sourcesParPointeur = new Map<string, Source>();
for (const rec of records.filter((r) => r.tag === "SOUR" && r.xref)) {
  const titre = trouverEnfant(rec, "TITL")?.valeur ?? "Source sans titre";
  const idPerso = trouverEnfant(rec, "_ID")?.valeur;
  const id = idPerso || slugifier(titre);
  const type = (trouverEnfant(rec, "_TYPE")?.valeur as Source["type"]) ?? "autre";
  const source: Source = {
    id,
    titre,
    type,
    cote: trouverEnfant(rec, "_COTE")?.valeur ?? null,
    depot: trouverEnfant(rec, "REPO")?.valeur ?? null,
    lien: trouverEnfant(rec, "PUBL")?.valeur ?? null,
    date: trouverEnfant(trouverEnfant(rec, "DATA") ?? rec, "DATE")?.valeur ?? null,
    notes: trouverEnfant(rec, "NOTE")?.valeur ?? null,
  };
  sourcesParPointeur.set(rec.xref!, source);
}

function sourceIdsDe(noeud: NoeudGedcom): string[] {
  return trouverEnfants(noeud, "SOUR")
    .map((s) => sourcesParPointeur.get((s.valeur || "").replace(/@/g, ""))?.id)
    .filter((id): id is string => Boolean(id));
}

function quayMaxDe(noeud: NoeudGedcom): number | null {
  const quays = trouverEnfants(noeud, "SOUR")
    .map((s) => trouverEnfant(s, "QUAY")?.valeur)
    .filter((v): v is string => Boolean(v))
    .map((v) => parseInt(v, 10));
  return quays.length > 0 ? Math.max(...quays) : null;
}

function lireEvenement(noeud: NoeudGedcom | undefined, type: Evenement["type"]): Evenement | null {
  if (!noeud) return null;
  const dateBrute = trouverEnfant(noeud, "DATE")?.valeur ?? null;
  const dateIso = dateBrute ? depuisDateGedcom(dateBrute) : null;
  const sourceIds = sourceIdsDe(noeud);
  const statut: Statut = quayVersStatut(quayMaxDe(noeud), sourceIds.length > 0);
  const placBrut = trouverEnfant(noeud, "PLAC")?.valeur ?? null;
  return {
    type,
    date: dateIso,
    dateTexte: dateBrute && !dateIso ? dateBrute : null,
    lieuId: placBrut ? lieuIdParTexte.get(placBrut) ?? null : null,
    notes: trouverEnfant(noeud, "NOTE")?.valeur ?? null,
    statut,
    sourceIds,
  };
}

// --- Individus -----------------------------------------------------------
interface IndividuBrut {
  pointeur: string;
  id: string;
  personne: Personne;
  famcPointeur: string | null;
  famsPointeurs: string[];
}

const individus: IndividuBrut[] = [];
for (const rec of records.filter((r) => r.tag === "INDI" && r.xref)) {
  const nomNoeud = trouverEnfant(rec, "NAME")?.valeur ?? "/INCONNU/";
  const m = nomNoeud.match(/^(.*?)\s*\/(.*)\/\s*$/);
  const prenoms = (m ? m[1] : nomNoeud).trim().split(/\s+/).filter(Boolean);
  const nom = (m ? m[2] : "").trim() || "INCONNU";

  const id = trouverEnfant(rec, "_ID")?.valeur || slugifier(`${nom}-${prenoms.join("-")}`);
  const sexe = (trouverEnfant(rec, "SEX")?.valeur as "M" | "F") ?? "M";
  const vivantBrut = trouverEnfant(rec, "_VIVANT")?.valeur;
  const statut = (trouverEnfant(rec, "_STATUT")?.valeur as Statut) ?? "temoignage";
  const branche = (trouverEnfant(rec, "_BRANCHE")?.valeur as Branche) ?? "alliee";

  const professions = trouverEnfants(rec, "OCCU").map((o) => ({
    intitule: o.valeur,
    periode: trouverEnfant(o, "DATE")?.valeur ?? null,
    sourceIds: sourceIdsDe(o),
  }));

  const naissance = lireEvenement(trouverEnfant(rec, "BIRT"), "naissance");
  const deces = lireEvenement(trouverEnfant(rec, "DEAT"), "deces");

  const personne: Personne = {
    id,
    nom,
    prenoms: prenoms.length > 0 ? prenoms : ["Inconnu"],
    prenomUsuel: trouverEnfant(rec, "NICK")?.valeur ?? null,
    prenomHebraique: trouverEnfant(rec, "_PRENOM_HEBRAIQUE")?.valeur ?? null,
    variantesGraphiques: trouverEnfant(rec, "_VARIANTES")?.valeur?.split(",").map((s) => s.trim()) ?? null,
    sexe,
    naissance,
    mariages: null,
    deces,
    professions: professions.length > 0 ? professions : null,
    pereId: null,
    mereId: null,
    // Un GEDCOM externe ne distingue pas la certitude du lien de filiation de
    // celle de la personne : on laisse le champ vide, il retombera sur le
    // statut de la personne à l'affichage.
    statutFiliation: null,
    conjointIds: null,
    enfantIds: null,
    branche,
    vivant: vivantBrut ? vivantBrut === "Y" : false,
    notes: trouverEnfant(rec, "NOTE")?.valeur ?? null,
    statut,
    sourceIds: sourceIdsDe(rec),
  };

  individus.push({
    pointeur: rec.xref!,
    id,
    personne,
    famcPointeur: trouverEnfant(rec, "FAMC")?.valeur.replace(/@/g, "") ?? null,
    famsPointeurs: trouverEnfants(rec, "FAMS").map((f) => f.valeur.replace(/@/g, "")),
  });
}

const parPointeurIndi = new Map(individus.map((i) => [i.pointeur, i]));

// --- Familles : reconstruction des liens --------------------------------
for (const rec of records.filter((r) => r.tag === "FAM" && r.xref)) {
  const husbPtr = trouverEnfant(rec, "HUSB")?.valeur.replace(/@/g, "");
  const wifePtr = trouverEnfant(rec, "WIFE")?.valeur.replace(/@/g, "");
  const enfantsPtr = trouverEnfants(rec, "CHIL").map((c) => c.valeur.replace(/@/g, ""));
  const husb = husbPtr ? parPointeurIndi.get(husbPtr) : undefined;
  const wife = wifePtr ? parPointeurIndi.get(wifePtr) : undefined;
  const mariage = lireEvenement(trouverEnfant(rec, "MARR"), "mariage");

  if (husb && wife) {
    husb.personne.conjointIds = [...new Set([...(husb.personne.conjointIds ?? []), wife.id])];
    wife.personne.conjointIds = [...new Set([...(wife.personne.conjointIds ?? []), husb.id])];
    if (mariage) {
      husb.personne.mariages = [...(husb.personne.mariages ?? []), mariage];
      wife.personne.mariages = [...(wife.personne.mariages ?? []), mariage];
    }
  }
  for (const ePtr of enfantsPtr) {
    const enfant = parPointeurIndi.get(ePtr);
    if (!enfant) continue;
    if (husb) enfant.personne.pereId = husb.id;
    if (wife) enfant.personne.mereId = wife.id;
    if (husb) husb.personne.enfantIds = [...new Set([...(husb.personne.enfantIds ?? []), enfant.id])];
    if (wife) wife.personne.enfantIds = [...new Set([...(wife.personne.enfantIds ?? []), enfant.id])];
  }
}

// --- Écriture ------------------------------------------------------------
const dossierPersonnes = join(DOSSIER_SORTIE, "personnes");
const dossierSources = join(DOSSIER_SORTIE, "sources");
for (const d of [dossierPersonnes, dossierSources]) {
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
}

for (const s of sourcesParPointeur.values()) {
  writeFileSync(join(dossierSources, `${s.id}.json`), JSON.stringify(s, null, 2) + "\n", "utf-8");
}
for (const i of individus) {
  writeFileSync(join(dossierPersonnes, `${i.id}.json`), JSON.stringify(i.personne, null, 2) + "\n", "utf-8");
}

console.log(
  `Import terminé : ${individus.length} personnes et ${sourcesParPointeur.size} sources écrites dans ${DOSSIER_SORTIE}.\n` +
    `Vérifie ensuite avec npm run validate:data — un GEDCOM externe n'a pas nos statuts \"prouve\"/\"temoignage\"/\"hypothese\"/\"inconnu\" natifs : ceux importés depuis un champ _STATUT absent retombent sur \"temoignage\" par défaut et doivent être relus.`
);
