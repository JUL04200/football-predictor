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
    id: "abraham-generation",
    question: "Abraham Arrouasse est-il le père ou le grand-père de Jean ?",
    contexte:
      "Le témoignage familial ne permet pas de trancher entre les deux générations. Aucun lien structurel (pereId) n'est posé dans les données tant que la génération n'est pas confirmée.",
    statut: "ouverte",
    personnesLiees: ["arrouasse-abraham", "arrouasse-jean"],
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
      "Quel lien exact entre notre ligne et le noyau David → Messaoud de Tlemcen ?",
    contexte:
      "David Arrouasse × Meriem Sakoun et leur fils Messaoud (né 1885) sont solidement documentés par des actes ANOM, mais rien ne relie ce noyau à Jean Arrouasse ou à Abraham Arrouasse.",
    statut: "ouverte",
    personnesLiees: ["arrouasse-david", "arrouasse-messaoud-1885", "arrouasse-jean"],
  },
  {
    id: "cousins-vivants",
    question:
      "Que peuvent nous apprendre les cousins vivants — Serge Arrouasse, Gérard Arrouasse, la descendance Bénichou ?",
    contexte:
      "Serge Arrouasse (fils de Maurice Arrouasse, 1932-2017) est identifié dans les données. Gérard Arrouasse et la descendance Bénichou (par le mariage d'Alice Arrouasse en 1937) sont mentionnés mais aucune fiche n'a pu être créée faute de données suffisantes.",
    statut: "ouverte",
    personnesLiees: ["arrouasse-serge", "arrouasse-maurice-1932"],
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
