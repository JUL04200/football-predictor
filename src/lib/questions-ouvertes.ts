export type StatutQuestion = "ouverte" | "en_cours" | "resolue";

export interface QuestionOuverte {
  id: string;
  question: string;
  contexte: string;
  statut: StatutQuestion;
  personnesLiees: string[];
}

export const LIBELLES_STATUT_QUESTION: Record<StatutQuestion, string> = {
  ouverte: "Ouverte",
  en_cours: "En cours",
  resolue: "Résolue",
};

export const QUESTIONS_OUVERTES: QuestionOuverte[] = [
  {
    id: "jean-naissance",
    question:
      "Où et quand Jean Arrouasse est-il né ? Quels sont les prénoms de ses parents ?",
    contexte:
      "Une date (14 mars 1938, Tlemcen) est connue par témoignage familial mais n'est recoupée avec aucun acte d'état civil. Les prénoms des parents de Jean restent inconnus.",
    statut: "en_cours",
    personnesLiees: ["arrouasse-jean"],
  },
  {
    id: "amram-generation",
    question: "Amram Arrouasse est-il le père ou le grand-père de Jean ?",
    contexte:
      "Résolue par le témoignage familial : Amram Arrouasse est le père de Jean, et son épouse Camille Arues en est la mère. Le lien est désormais posé dans les données. Son prénom avait d'abord été transmis sous la forme « Abraham » : les deux graphies sont conservées, une recherche d'archives devant tester l'une et l'autre. Il reste à confirmer la filiation par un acte.",
    statut: "resolue",
    personnesLiees: ["arrouasse-amram", "arues-camille", "arrouasse-jean"],
  },
  {
    id: "lea-origine",
    question: "Où Léa Benchetrit est-elle née, et d'où venaient ses parents ?",
    contexte:
      "Question ouverte prioritaire du site. Aucune information sur le lieu de naissance de Léa ni sur l'origine de ses parents n'a été retrouvée à ce jour.",
    statut: "ouverte",
    personnesLiees: ["benchetrit-lea"],
  },
  {
    id: "lien-noyau-tlemcen",
    question:
      "Peut-on prouver par un acte que les parents d'Amram sont bien David Arrouasse et Meriem Sakoun ?",
    contexte:
      "Le témoignage familial donne pour frères d'Amram Joseph et Messaoud, et pour demi-frère Moïse. L'acte de naissance de Messaoud (1885) nommant David Arrouasse et Meriem Sakoun, ces derniers sont par déduction les parents d'Amram : la ligne directe rejoint donc le noyau documenté de Tlemcen. Trois recoupements le soutiennent — Amram né en 1904 entre dans la fenêtre de naissance des enfants de Meriem, morte en 1906 ; le cousinage rapporté entre Jean et Roger Amram Arrouasse s'explique exactement par cette structure ; un demi-frère par le père cadre avec un remariage de David après 1906. Rien de tout cela n'est un acte : dans l'arbre, ces filiations sont tracées en pointillé. Retrouver l'acte de naissance d'Amram, vers 1904 à Tlemcen, les transformerait en traits pleins.",
    statut: "en_cours",
    personnesLiees: [
      "arrouasse-amram",
      "arrouasse-roger-amram-1925",
      "arrouasse-david",
      "arrouasse-messaoud-1885",
      "arrouasse-jean",
    ],
  },
  {
    id: "cousins-vivants",
    question:
      "Que peuvent nous apprendre les proches vivants — les frères de Jean, Serge Arrouasse, la descendance Bénichou ?",
    contexte:
      "Gérard Arrouasse et Daniel Arrouasse, devenu Achache, sont les frères vivants de Jean : ce sont eux qui ont connu Amram et Camille de leur vivant, et donc les mieux placés pour donner les dates, les lieux et les noms qui manquent encore en haut de l'arbre. Serge Arrouasse, fils de Maurice (1932-2017), reste le seul contact possible du côté de la branche non rattachée. La descendance Bénichou, issue du mariage d'Alice Arrouasse en 1937, n'est documentée par aucune fiche faute d'éléments.",
    statut: "ouverte",
    personnesLiees: [
      "arrouasse-gerard",
      "arrouasse-daniel",
      "arrouasse-serge",
      "arrouasse-maurice-1932",
    ],
  },
  {
    id: "jean-lyon",
    question:
      "Que devient la trace de Jean à Lyon : registre du commerce, annuaires, dossier de rapatriement ANIFOM ?",
    contexte:
      "La boulangerie Le Pain de la Cité à Lyon n'a fait l'objet d'aucune recherche dans le registre du commerce, les annuaires professionnels ou les archives de rapatriement (ANIFOM).",
    statut: "ouverte",
    personnesLiees: ["arrouasse-jean"],
  },
];
