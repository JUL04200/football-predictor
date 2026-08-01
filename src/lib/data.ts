import {
  PersonneSchema,
  SourceSchema,
  LieuSchema,
  EvenementHistoriqueSchema,
  type Personne,
  type Source,
  type Lieu,
  type EvenementHistorique,
} from "./schema";
import { z } from "zod";

/**
 * Chargement + validation Zod de toutes les données au moment du build
 * Astro. Un fichier mal formé fait planter le build ici (Zod `.parse`,
 * pas `.safeParse`) — c'est la même règle que scripts/validate-data.ts,
 * appliquée cette fois dans le pipeline de rendu des pages.
 */

const fichiersPersonnes = import.meta.glob("../data/personnes/*.json", {
  eager: true,
  import: "default",
});
const fichiersSources = import.meta.glob("../data/sources/*.json", {
  eager: true,
  import: "default",
});

// PRIVATE_MODE : le propriétaire du site a explicitement demandé que toute
// la famille, vivants compris, soit visible — c'est donc le comportement par
// défaut. Pour revenir à un site public anonymisé (les personnes vivantes
// réduites à une fiche « Personne vivante », sans nom ni date), construire
// avec `PRIVATE_MODE=true npm run build`.
export const MODE_PRIVE = process.env.PRIVATE_MODE === "true";

function idDepuisChemin(chemin: string): string {
  const nom = chemin.split("/").pop() ?? "";
  return nom.replace(/\.json$/, "");
}

const personnesCompletes = new Map<string, Personne>();
for (const [chemin, contenu] of Object.entries(fichiersPersonnes)) {
  const id = idDepuisChemin(chemin);
  let donnee: Personne;
  try {
    donnee = PersonneSchema.parse(contenu);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new Error(
        `Fiche invalide : src/data/personnes/${id}.json\n` +
          err.issues.map((i) => `  - ${i.path.join(".") || "(racine)"} : ${i.message}`).join("\n")
      );
    }
    throw err;
  }
  if (donnee.id !== id) {
    throw new Error(
      `Fiche invalide : src/data/personnes/${id}.json — l'id "${donnee.id}" ne correspond pas au nom de fichier.`
    );
  }
  personnesCompletes.set(id, donnee);
}

const sources = new Map<string, Source>();
for (const [chemin, contenu] of Object.entries(fichiersSources)) {
  const id = idDepuisChemin(chemin);
  let donnee: Source;
  try {
    donnee = SourceSchema.parse(contenu);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new Error(
        `Source invalide : src/data/sources/${id}.json\n` +
          err.issues.map((i) => `  - ${i.path.join(".") || "(racine)"} : ${i.message}`).join("\n")
      );
    }
    throw err;
  }
  sources.set(id, donnee);
}

// Intégrité référentielle : toute sourceId citée par une personne doit
// exister dans le registre des sources, sinon le build échoue.
for (const p of personnesCompletes.values()) {
  const toutesSourceIds = [
    ...p.sourceIds,
    ...(p.professions ?? []).flatMap((pr) => pr.sourceIds),
    ...[p.naissance, p.deces, ...(p.mariages ?? [])]
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
      .flatMap((e) => e.sourceIds),
  ];
  for (const sid of toutesSourceIds) {
    if (!sources.has(sid)) {
      throw new Error(
        `Fiche src/data/personnes/${p.id}.json : source manquante "${sid}". ` +
          `Crée src/data/sources/${sid}.json ou corrige la référence.`
      );
    }
  }
}

import donneesLieux from "../data/lieux.json";
import donneesEvenements from "../data/evenements.json";

const lieux = new Map<string, Lieu>(
  z.array(LieuSchema).parse(donneesLieux).map((l) => [l.id, l])
);
const evenementsHistoriques: EvenementHistorique[] = z
  .array(EvenementHistoriqueSchema)
  .parse(donneesEvenements)
  .sort((a, b) => a.date.localeCompare(b.date));

/**
 * Vue publique d'une personne. Si elle est vivante et qu'on n'est pas en
 * PRIVATE_MODE=false, on ne renvoie qu'un squelette non identifiant.
 */
export type PersonneAffichee =
  | (Personne & { masquee: false })
  | {
      masquee: true;
      id: string;
      branche: Personne["branche"];
      sexe: Personne["sexe"];
      pereId: string | null;
      mereId: string | null;
      conjointIds: string[];
      enfantIds: string[];
    };

export function personneAffichee(p: Personne): PersonneAffichee {
  if (p.vivant && MODE_PRIVE) {
    return {
      masquee: true,
      id: p.id,
      branche: p.branche,
      sexe: p.sexe,
      pereId: p.pereId ?? null,
      mereId: p.mereId ?? null,
      conjointIds: p.conjointIds ?? [],
      enfantIds: p.enfantIds ?? [],
    };
  }
  return { ...p, masquee: false };
}

export function toutesLesPersonnes(): Personne[] {
  return [...personnesCompletes.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export function getPersonne(id: string): Personne | undefined {
  return personnesCompletes.get(id);
}

export function toutesLesSources(): Source[] {
  return [...sources.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export function getSource(id: string): Source | undefined {
  return sources.get(id);
}

export function personnesDocumenteesPar(sourceId: string): Personne[] {
  return toutesLesPersonnes().filter((p) => {
    const toutesSourceIds = [
      ...p.sourceIds,
      ...(p.professions ?? []).flatMap((pr) => pr.sourceIds),
      ...[p.naissance, p.deces, ...(p.mariages ?? [])]
        .filter((e): e is NonNullable<typeof e> => Boolean(e))
        .flatMap((e) => e.sourceIds),
    ];
    return toutesSourceIds.includes(sourceId);
  });
}

export function toutLesLieux(): Lieu[] {
  return [...lieux.values()];
}

export function getLieu(id: string | null | undefined): Lieu | undefined {
  if (!id) return undefined;
  return lieux.get(id);
}

export function toutesLesEvenementsHistoriques(): EvenementHistorique[] {
  return evenementsHistoriques;
}

export function nomAffiche(p: Personne): string {
  if (p.vivant && MODE_PRIVE) return "Personne vivante";
  return `${p.prenomUsuel ?? p.prenoms[0]} ${p.nom}`;
}

export function compteurs() {
  const toutes = toutesLesPersonnes();
  const prouvees = toutes.filter((p) => p.statut === "prouve").length;
  return { total: toutes.length, prouvees };
}
