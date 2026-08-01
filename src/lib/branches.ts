export interface ContenuBranche {
  slug: "arrouasse" | "amsellem" | "benchetrit";
  nom: string;
  ville: string;
  histoire: string[];
  onomastique: string;
  metiers: string[];
  famillesAlliees: string[];
}

export const BRANCHES: ContenuBranche[] = [
  {
    slug: "arrouasse",
    nom: "Arrouasse",
    ville: "Tlemcen",
    histoire: [
      "Tlemcen, à l'ouest de l'Algérie près de la frontière marocaine, abrite l'une des plus anciennes communautés juives d'Algérie, remontant au Moyen Âge. C'est dans cette ville que la famille Arrouasse est documentée depuis au moins 1884.",
      "Le noyau le mieux établi par les archives est celui de David Arrouasse, colporteur, et de son épouse Meriem Sakoun, dont le fils Messaoud naît à Tlemcen le 4 janvier 1885. Autour de ce noyau gravitent d'autres porteurs du nom Arrouasse à Tlemcen dans la première moitié du XXe siècle — Sadia, Fortunée, Josiane, Roger Amram, Maurice, Alice — sans qu'un lien de parenté précis avec ce noyau, ni avec la ligne directe de ce site (Jean Arrouasse), soit établi pour chacun.",
      "Le rattachement de Jean Arrouasse, né vers 1938 selon le témoignage familial, à ce tissu de familles Arrouasse de Tlemcen reste l'une des principales questions ouvertes de ce site.",
    ],
    onomastique:
      "Le nom ARROUASSE (et ses variantes ARROUAS, AROUAS, ARWAS, ROUAS) est rare. Selon le dictionnaire onomastique des noms juifs d'Afrique du Nord (d'après les travaux de Maurice Eisenbeth), ARROUAS / ROUAS / ROUACH dérive de l'arabe « ruwwâs », marchand de têtes de mouton grillées — un nom de métier, comme beaucoup de patronymes nord-africains.",
    metiers: [
      "Colporteur (David Arrouasse)",
      "Chaisier, puis entrepreneur du bâtiment (Messaoud Arrouasse)",
      "Professeur, puis boulanger (Jean Arrouasse, à Lyon)",
      "Ouvrier industriel, laverie, traiteur cachère, animateur radio (Maurice Arrouasse)",
      "Expert-comptable (Laurent Arrouasse)",
    ],
    famillesAlliees: ["Sakoun", "Boumendil", "Amsellem", "Bénichou (par le mariage d'Alice Arrouasse, 1937)"],
  },
  {
    slug: "amsellem",
    nom: "Amsellem",
    ville: "Alger",
    histoire: [
      "La branche Amsellem s'ancre à Alger, capitale de l'Algérie française et cœur de sa communauté juive, la plus nombreuse et la plus ancienne du pays à bénéficier du décret Crémieux de 1870.",
      "Mordechaï, dit Mardiche, Amsellem épouse Léa Benchetrit ; le couple a une fille, Josette, qui deviendra professeure puis commerçante en vêtements, et qui épousera Jean Arrouasse. L'origine de Léa Benchetrit — sa ville natale, l'origine de ses propres parents — n'est pas connue : c'est la question ouverte prioritaire de ce site.",
    ],
    onomastique:
      "AMSELLEM (parfois BENSELLAM, BOUSSELHAM selon les régions) est un nom fréquent chez les Juifs d'Afrique du Nord, rattaché à la racine arabe « salâm » (paix). Il ne doit pas être confondu, malgré la proximité phonétique, avec Benchetrit (voir la branche Benchetrit).",
    metiers: ["Professeure, puis commerçante en vêtements (Josette Amsellem)"],
    famillesAlliees: ["Benchetrit", "Arrouasse (par le mariage de Josette Amsellem et Jean Arrouasse)"],
  },
  {
    slug: "benchetrit",
    nom: "Benchetrit",
    ville: "Alger (par le mariage de Léa Benchetrit)",
    histoire: [
      "Léa Benchetrit épouse Mordechaï (Mardiche) Amsellem à Alger, selon le témoignage familial. Son propre lieu de naissance et l'origine géographique de ses parents ne sont pas connus : c'est, à ce jour, le principal trou documentaire de ce site.",
      "Le nom Benchetrit a pour berceau documenté le Tafilalet, région du sud-est marocain, avant de se disperser dans plusieurs villes d'Algérie et du Maroc au fil des siècles. Rien ne permet, en l'état des recherches, de savoir par quelle voie et à quelle génération la lignée de Léa serait arrivée en Algérie — ni même de confirmer qu'elle y est née.",
    ],
    onomastique:
      "CHETRIT / BENCHETRIT vient de l'arabe « shâtir », le brave (Joseph Toledano, *Les noms de famille juifs d'Afrique du Nord*). Le Tafilalet marocain en est le berceau documenté, d'où le nom essaime vers de nombreuses villes du Maghreb.",
    metiers: [],
    famillesAlliees: ["Amsellem (par le mariage de Léa Benchetrit et Mordechaï Amsellem)"],
  },
];

export function getBranche(slug: string): ContenuBranche | undefined {
  return BRANCHES.find((b) => b.slug === slug);
}
