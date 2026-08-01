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
      "Qui étaient les parents d'Amram Arrouasse, et le relient-ils au noyau David → Messaoud de Tlemcen ?",
    contexte:
      "La ligne directe remonte désormais à Amram Arrouasse, né en 1904 à Tlemcen, et à Camille Arues, née en 1913. Mais les parents d'Amram restent inconnus : c'est là que la ligne s'arrête. Sa date de naissance permet une première élimination formelle : né en 1904, il ne peut pas être un enfant de Messaoud Arrouasse et Djohar Boumendil, mariés en 1911. Elle laisse en revanche ouverte l'hypothèse qu'il soit un fils tardif de David Arrouasse et Meriem Sakoun, donc un frère cadet de Messaoud — compatible avec les dates, mais nullement démontré. Retrouver son acte de naissance à Tlemcen autour de 1904 nommerait ses parents et trancherait d'un coup : c'est la recherche la plus prometteuse du site. Voir le journal de recherche pour le détail du raisonnement.",
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
