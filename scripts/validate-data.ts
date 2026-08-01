import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import {
  PersonneSchema,
  SourceSchema,
  LieuSchema,
  EvenementHistoriqueSchema,
  type Personne,
  type Source,
  type Lieu,
} from "../src/lib/schema.ts";

const RACINE = new URL("../src/data/", import.meta.url).pathname;

type Erreur = { fichier: string; message: string };

const erreurs: Erreur[] = [];
const avertissements: Erreur[] = [];

function listerJson(dossier: string): string[] {
  return readdirSync(join(RACINE, dossier))
    .filter((f) => f.endsWith(".json"))
    .sort();
}

function chargerJson(chemin: string): unknown {
  return JSON.parse(readFileSync(chemin, "utf-8"));
}

function formatterErreurZod(prefixe: string, err: z.ZodError): Erreur[] {
  return err.issues.map((issue) => ({
    fichier: prefixe,
    message: `${issue.path.join(".") || "(racine)"} — ${issue.message}`,
  }));
}

// --- 1. Sources ---------------------------------------------------------
const sources = new Map<string, Source>();
for (const fichier of listerJson("sources")) {
  const chemin = `src/data/sources/${fichier}`;
  const resultat = SourceSchema.safeParse(chargerJson(join(RACINE, "sources", fichier)));
  if (!resultat.success) {
    erreurs.push(...formatterErreurZod(chemin, resultat.error));
    continue;
  }
  if (resultat.data.id !== fichier.replace(/\.json$/, "")) {
    erreurs.push({
      fichier: chemin,
      message: `l'id "${resultat.data.id}" ne correspond pas au nom de fichier.`,
    });
  }
  sources.set(resultat.data.id, resultat.data);
}

// --- 2. Lieux ------------------------------------------------------------
const lieux = new Map<string, Lieu>();
const lieuxBruts = chargerJson(join(RACINE, "lieux.json"));
const lieuxResultat = z.array(LieuSchema).safeParse(lieuxBruts);
if (!lieuxResultat.success) {
  erreurs.push(...formatterErreurZod("src/data/lieux.json", lieuxResultat.error));
} else {
  for (const lieu of lieuxResultat.data) lieux.set(lieu.id, lieu);
}

// --- 3. Événements historiques --------------------------------------------
const evenementsResultat = z
  .array(EvenementHistoriqueSchema)
  .safeParse(chargerJson(join(RACINE, "evenements.json")));
if (!evenementsResultat.success) {
  erreurs.push(...formatterErreurZod("src/data/evenements.json", evenementsResultat.error));
}

// --- 4. Personnes ----------------------------------------------------------
const personnes = new Map<string, Personne>();
for (const fichier of listerJson("personnes")) {
  const chemin = `src/data/personnes/${fichier}`;
  const resultat = PersonneSchema.safeParse(chargerJson(join(RACINE, "personnes", fichier)));
  if (!resultat.success) {
    erreurs.push(...formatterErreurZod(chemin, resultat.error));
    continue;
  }
  if (resultat.data.id !== fichier.replace(/\.json$/, "")) {
    erreurs.push({
      fichier: chemin,
      message: `l'id "${resultat.data.id}" ne correspond pas au nom de fichier.`,
    });
  }
  personnes.set(resultat.data.id, resultat.data);
}

// --- 5. Intégrité référentielle --------------------------------------------
// Sources et lieux forment un référentiel fermé et restreint : toute
// référence cassée y est une erreur bloquante ("une source manquante doit
// faire échouer le build").
// Les personnes forment un registre qui grandit fiche par fiche : une
// référence vers une personne pas encore créée est un avertissement, pas
// un échec de build, tant que le jeu de données est en construction.
function verifierSourceIds(chemin: string, champ: string, sourceIds: string[]) {
  for (const id of sourceIds) {
    if (!sources.has(id)) {
      erreurs.push({ fichier: chemin, message: `${champ} référence la source manquante "${id}".` });
    }
  }
}

function verifierLieuId(chemin: string, champ: string, lieuId: string | null | undefined) {
  if (lieuId && !lieux.has(lieuId)) {
    erreurs.push({ fichier: chemin, message: `${champ} référence le lieu manquant "${lieuId}".` });
  }
}

function verifierPersonneId(chemin: string, champ: string, id: string | null | undefined) {
  if (id && !personnes.has(id)) {
    avertissements.push({
      fichier: chemin,
      message: `${champ} référence "${id}", qui n'existe pas encore dans src/data/personnes/.`,
    });
  }
}

for (const [id, p] of personnes) {
  const chemin = `src/data/personnes/${id}.json`;
  verifierSourceIds(chemin, "sourceIds", p.sourceIds);
  for (const prof of p.professions ?? []) verifierSourceIds(chemin, `professions[].sourceIds`, prof.sourceIds);
  for (const ev of [p.naissance, p.deces, ...(p.mariages ?? [])]) {
    if (!ev) continue;
    verifierSourceIds(chemin, `${ev.type}.sourceIds`, ev.sourceIds);
    verifierLieuId(chemin, `${ev.type}.lieuId`, ev.lieuId);
  }
  verifierPersonneId(chemin, "pereId", p.pereId);
  verifierPersonneId(chemin, "mereId", p.mereId);
  for (const cid of p.conjointIds ?? []) verifierPersonneId(chemin, "conjointIds[]", cid);
  for (const eid of p.enfantIds ?? []) verifierPersonneId(chemin, "enfantIds[]", eid);
}

// --- Rapport -----------------------------------------------------------
console.log(
  `Validation : ${personnes.size} personne(s), ${sources.size} source(s), ${lieux.size} lieu(x).`
);

if (avertissements.length > 0) {
  console.log(`\n${avertissements.length} avertissement(s) (référence à une personne pas encore créée) :`);
  for (const a of avertissements) console.log(`  \x1b[33m⚠\x1b[0m  ${a.fichier} : ${a.message}`);
}

if (erreurs.length > 0) {
  console.error(`\n${erreurs.length} erreur(s) bloquante(s) :`);
  for (const e of erreurs) console.error(`  \x1b[31m✗\x1b[0m  ${e.fichier} : ${e.message}`);
  console.error("\nBuild interrompu : corrige les fiches ci-dessus avant de continuer.\n");
  process.exit(1);
}

console.log("\n\x1b[32m✓\x1b[0m Toutes les fiches sont valides.\n");
