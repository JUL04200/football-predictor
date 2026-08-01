import { z } from "zod";

/**
 * Schéma central du projet. Toute fiche JSON de src/data/ est validée contre
 * ces schémas au moment du build (voir scripts/validate-data.ts, appelé par
 * `npm run validate:data` et par `npm run build`).
 *
 * Règle non négociable du projet : une donnée au statut "prouve" doit
 * obligatoirement référencer au moins une source (sourceIds non vide).
 * Cette règle est appliquée par `.superRefine` à trois niveaux : la fiche
 * Personne elle-même, chaque Evenement (naissance, mariage, décès) et,
 * transitivement, tout ce qui s'affiche avec un badge "Prouvé" côté UI.
 */

const idKebabCase = z
  .string()
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    "L'id doit être en minuscules et en kebab-case, ex: \"arrouasse-jean\"."
  );

// Une date de fiche est soit inconnue (null), soit un fragment ISO
// AAAA, AAAA-MM ou AAAA-MM-JJ. On n'accepte jamais de date approximative
// écrite en dur ici : la date approximative va dans `dateTexte`.
const dateFragment = z
  .string()
  .regex(
    /^\d{4}(-\d{2}(-\d{2})?)?$/,
    "La date doit être au format AAAA, AAAA-MM ou AAAA-MM-JJ (utiliser dateTexte pour une date approximative)."
  );

export const StatutSchema = z.enum(["prouve", "temoignage", "hypothese", "inconnu"], {
  errorMap: () => ({
    message: 'statut doit être "prouve", "temoignage", "hypothese" ou "inconnu".',
  }),
});
export type Statut = z.infer<typeof StatutSchema>;

export const BrancheSchema = z.enum(["arrouasse", "amsellem", "benchetrit", "alliee"]);
export type Branche = z.infer<typeof BrancheSchema>;

function exigerSourceSiProuve(
  statut: Statut,
  sourceIds: string[],
  ctx: z.RefinementCtx
) {
  if (statut === "prouve" && sourceIds.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'statut "prouve" sans sourceIds : une donnée prouvée doit citer au moins une source. ' +
        'Utilise "temoignage" ou "hypothese" tant qu\'aucune source n\'est référencée.',
      path: ["sourceIds"],
    });
  }
}

export const EvenementSchema = z
  .object({
    type: z.enum(["naissance", "mariage", "deces", "autre"]),
    date: dateFragment.nullable().optional().default(null),
    dateTexte: z.string().nullable().optional().default(null),
    lieuId: idKebabCase.nullable().optional().default(null),
    notes: z.string().nullable().optional().default(null),
    statut: StatutSchema,
    sourceIds: z.array(z.string()).default([]),
  })
  .superRefine((ev, ctx) => exigerSourceSiProuve(ev.statut, ev.sourceIds, ctx));
export type Evenement = z.infer<typeof EvenementSchema>;

export const ProfessionSchema = z.object({
  intitule: z.string().min(1),
  periode: z.string().nullable().optional().default(null),
  sourceIds: z.array(z.string()).default([]),
});
export type Profession = z.infer<typeof ProfessionSchema>;

export const PersonneSchema = z
  .object({
    id: idKebabCase,
    nom: z.string().min(1),
    prenoms: z.array(z.string().min(1)).min(1, "Au moins un prénom est requis."),
    prenomUsuel: z.string().nullable().optional().default(null),
    prenomHebraique: z.string().nullable().optional().default(null),
    variantesGraphiques: z.array(z.string()).nullable().optional().default(null),
    sexe: z.enum(["M", "F"]),
    naissance: EvenementSchema.nullable().optional().default(null),
    mariages: z.array(EvenementSchema).nullable().optional().default(null),
    deces: EvenementSchema.nullable().optional().default(null),
    professions: z.array(ProfessionSchema).nullable().optional().default(null),
    pereId: idKebabCase.nullable().optional().default(null),
    mereId: idKebabCase.nullable().optional().default(null),
    // Statut du lien de filiation lui-même, distinct de celui de la personne :
    // on peut connaître quelqu'un par un acte tout en ne tenant son
    // rattachement que d'un témoignage. Absent, il reprend le statut de la
    // personne. L'arbre trace en trait plein les filiations prouvées, en
    // pointillé les autres.
    statutFiliation: StatutSchema.nullable().optional().default(null),
    conjointIds: z.array(idKebabCase).nullable().optional().default(null),
    enfantIds: z.array(idKebabCase).nullable().optional().default(null),
    branche: BrancheSchema,
    vivant: z.boolean(),
    notes: z.string().nullable().optional().default(null),
    statut: StatutSchema,
    sourceIds: z.array(z.string()).default([]),
  })
  .superRefine((p, ctx) => {
    exigerSourceSiProuve(p.statut, p.sourceIds, ctx);
    if (p.deces && p.vivant) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Une personne avec un événement de décès ne peut pas avoir vivant: true.",
        path: ["vivant"],
      });
    }
  });
export type Personne = z.infer<typeof PersonneSchema>;

export const SourceTypeSchema = z.enum([
  "acte_naissance",
  "acte_mariage",
  "acte_deces",
  "etat_civil",
  "presse",
  "annuaire",
  "recensement",
  "insee_deces",
  "institution",
  "bibliographie",
  "temoignage_oral",
  "autre",
]);
export type SourceType = z.infer<typeof SourceTypeSchema>;

export const SourceSchema = z.object({
  id: idKebabCase,
  titre: z.string().min(1),
  type: SourceTypeSchema,
  cote: z.string().nullable().optional().default(null),
  depot: z.string().nullable().optional().default(null),
  lien: z.string().url().nullable().optional().default(null),
  date: z.string().nullable().optional().default(null),
  notes: z.string().nullable().optional().default(null),
});
export type Source = z.infer<typeof SourceSchema>;

export const LieuSchema = z.object({
  id: idKebabCase,
  nom: z.string().min(1),
  nomHistorique: z.string().nullable().optional().default(null),
  pays: z.string().min(1),
  latitude: z.number().nullable().optional().default(null),
  longitude: z.number().nullable().optional().default(null),
  notes: z.string().nullable().optional().default(null),
});
export type Lieu = z.infer<typeof LieuSchema>;

// Événements de contexte historique (décret Crémieux, Vichy, indépendance…)
// utilisés par la page Chronologie, distincts des Evenement biographiques
// qui vivent à l'intérieur des fiches Personne.
export const EvenementHistoriqueSchema = z.object({
  id: idKebabCase,
  date: dateFragment,
  titre: z.string().min(1),
  description: z.string().min(1),
  lieuId: idKebabCase.nullable().optional().default(null),
  sourceIds: z.array(z.string()).default([]),
});
export type EvenementHistorique = z.infer<typeof EvenementHistoriqueSchema>;
