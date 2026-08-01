export interface QuestionFaq {
  id: string;
  question: string;
  reponse: string[];
}

export interface CategorieFaq {
  id: string;
  titre: string;
  questions: QuestionFaq[];
}

export const FAQ: CategorieFaq[] = [
  {
    id: "famille",
    titre: "Sur la famille",
    questions: [
      {
        id: "origine-nom-arrouasse",
        question: "D'où vient le nom Arrouasse, et pourquoi est-il si rare ?",
        reponse: [
          "Selon le dictionnaire onomastique des noms juifs d'Afrique du Nord (d'après les travaux de Maurice Eisenbeth), ARROUAS / ROUAS / ROUACH vient de l'arabe « ruwwâs », marchand de têtes de mouton grillées : un nom de métier, comme une grande partie des patronymes nord-africains.",
          "Sa rareté tient à deux choses. D'abord, peu de familles semblent l'avoir porté à Tlemcen même — les mentions retrouvées à ce jour concernent un nombre limité de personnes sur plusieurs générations. Ensuite, la transcription d'un nom arabe par l'état civil français au XIXe et au XXe siècle n'était pas standardisée : selon l'officier d'état civil, l'époque et la prononciation locale, le même nom de famille a pu être écrit ARROUASSE, ARROUAS, AROUAS, ARWAS ou ROUAS. C'est pour cette raison que chaque fiche de ce site liste les « variantes graphiques » connues : une recherche d'archives qui ne teste qu'une seule orthographe rate une partie des actes.",
        ],
      },
      {
        id: "plusieurs-prenoms",
        question:
          "Pourquoi les mêmes personnes apparaissent-elles sous plusieurs prénoms (Mordechaï / Mardiche / Mardochée / Maurice) ?",
        reponse: [
          "C'est une pratique très répandue chez les Juifs d'Afrique du Nord : un prénom hébraïque ou religieux (Mordechaï), un diminutif ou une forme d'usage dans la famille et la communauté (Mardiche), une transcription francisée utilisée par l'administration (Mardochée, Mardoché), et parfois un prénom d'usage complètement différent adopté dans la vie civile ou après l'installation en France (Maurice). La même personne peut ainsi apparaître sous quatre noms différents selon qu'elle est citée dans un acte religieux, un acte d'état civil français, ou par un témoignage familial.",
          "C'est pour cette raison que le champ « variantesGraphiques » existe sur chaque fiche de ce site, et pourquoi il faut se méfier d'un arbre qui ne relierait pas ces formes entre elles : deux mentions d'apparence différente peuvent être la même personne, et deux personnes différentes peuvent, à l'inverse, partager le même prénom d'usage (voir la question sur Messaoud Arrouasse dans le journal de recherche).",
        ],
      },
      {
        id: "professions",
        question: "Que faisaient nos ancêtres ? (colporteur, chaisier, entrepreneur, professeur, commerçant)",
        reponse: [
          "Les professions documentées dessinent une trajectoire assez lisible sur trois à quatre générations. À Tlemcen à la fin du XIXe siècle, David Arrouasse est colporteur — un métier itinérant, à faible capital de départ, très commun pour des familles juives dans des sociétés où la propriété foncière ou certaines corporations leur étaient historiquement fermées. Son fils Messaoud est chaisier, un artisanat sédentaire, avant d'être cité comme entrepreneur du bâtiment dans les années 1940 : une ascension sociale typique d'une génération à l'autre.",
          "Plus tard, Jean Arrouasse est professeur avant de devenir commerçant (boulangerie) à Lyon, et son épouse Josette Amsellem suit un chemin comparable, professeure puis commerçante en vêtements. L'accès à l'enseignement pour cette génération est directement lié à la citoyenneté française acquise par le décret Crémieux de 1870 (voir la question correspondante) : sans cette citoyenneté, l'accès aux professions et aux concours de la fonction publique française aurait été fermé.",
          "Le commerce — notamment le textile — est également une reconversion très fréquente chez les familles séfarades pieds-noirs après le départ de 1962, le temps de reconstruire un capital professionnel en France.",
        ],
      },
      {
        id: "pourquoi-algerie",
        question: "Pourquoi toutes les branches viennent-elles d'Algérie ?",
        reponse: [
          "Les communautés juives d'Algérie sont parmi les plus anciennes d'Afrique du Nord : certaines remontent à l'Antiquité, d'autres se sont renforcées après l'expulsion des Juifs d'Espagne en 1492. Tlemcen, en particulier, a accueilli une importante communauté de réfugiés ibériques et est restée un centre religieux et intellectuel juif majeur pendant des siècles — ce qui explique la présence ancienne du nom Arrouasse dans cette ville.",
          "Les deux lignées de ce site — Arrouasse à Tlemcen, Amsellem et Benchetrit à Alger — sont donc simplement les deux points d'ancrage géographiques où se trouvaient les familles au moment de la colonisation française puis, plus tard, au moment du départ de 1962. Ce n'est pas un choix : c'est la géographie de la communauté juive d'Algérie de l'Ouest et du Centre à cette époque.",
        ],
      },
    ],
  },
  {
    id: "histoire",
    titre: "Sur l'histoire",
    questions: [
      {
        id: "decret-cremieux",
        question:
          "Qu'est-ce que le décret Crémieux de 1870 et qu'a-t-il changé pour la famille ?",
        reponse: [
          "Le décret du 24 octobre 1870, porté par le ministre de la Justice Adolphe Crémieux, accorde collectivement la citoyenneté française aux Juifs des territoires civils d'Algérie (environ 35 000 à 37 000 personnes à l'époque), à l'exception des territoires du Sud restés sous administration militaire. Du jour au lendemain, ils cessent d'être soumis au statut personnel israélite pour devenir citoyens français à part entière — un statut que la population musulmane d'Algérie, pourtant très largement majoritaire, n'obtiendra jamais collectivement pendant toute la période coloniale.",
          "Pour une famille comme celle-ci, cette citoyenneté a été la condition d'accès à l'école publique française, aux concours de la fonction publique et à des professions comme l'enseignement — un chemin que l'on retrouve directement dans les professions de Jean Arrouasse et Josette Amsellem.",
        ],
      },
      {
        id: "1940-1943",
        question: "Que s'est-il passé pour les Juifs d'Algérie entre 1940 et 1943 ?",
        reponse: [
          "Bien que l'Algérie n'ait pas été occupée par l'Allemagne, elle était administrée par le régime de Vichy, qui y applique ses lois antijuives dès l'automne 1940 : le statut des Juifs du 3 octobre 1940 les exclut de la fonction publique, de l'armée, de la magistrature, de l'enseignement et de nombreuses professions libérales. Quatre jours plus tard, la loi du 7 octobre 1940 abroge purement et simplement le décret Crémieux : les Juifs d'Algérie perdent la citoyenneté française et redeviennent des sujets de statut local, une mesure sans équivalent ailleurs dans l'empire colonial français.",
          "Le débarquement allié du 8 novembre 1942 (opération Torch) ne met pas fin immédiatement à cette situation : l'administration qui prend le relais à Alger maintient les lois antijuives plusieurs mois supplémentaires, un épisode resté comme l'un des plus amers de cette période. Il faut attendre l'ordonnance du 14 mars 1943 pour que le décret Crémieux soit rétabli et la citoyenneté restituée.",
        ],
      },
      {
        id: "depart-1962",
        question: "Pourquoi la famille est-elle partie en 1962, et comment ?",
        reponse: [
          "Les accords d'Évian de mars 1962 mettent fin à la guerre d'Algérie ; l'indépendance est proclamée le 5 juillet 1962. Dans les mois qui précèdent et suivent, la confiance intercommunautaire s'effondre, la violence (notamment celle de l'OAS et ses conséquences) s'intensifie, et un climat d'insécurité pousse la quasi-totalité de la population européenne et juive d'Algérie à partir en quelques semaines — un exode d'une ampleur et d'une rapidité rares dans l'histoire du XXe siècle.",
          "Le départ se fait principalement par bateau depuis les grands ports algériens vers Marseille (une partie par avion). Le témoignage familial situe le départ de Maurice Arrouasse à Oran, sur le Ville d'Oran, en 1962. En France, les arrivants sont administrativement des « rapatriés » ; certains ont constitué un dossier auprès de l'ANIFOM (Agence nationale pour l'indemnisation des Français d'outre-mer) pour l'indemnisation des biens perdus — un dossier qui, s'il existe pour Jean Arrouasse, n'a pas encore été recherché (voir les questions ouvertes).",
        ],
      },
      {
        id: "pied-noir",
        question: "Qu'est-ce qu'un « pied-noir », et le terme s'applique-t-il aux Juifs d'Algérie ?",
        reponse: [
          "L'origine exacte de l'expression « pied-noir » reste débattue chez les historiens — plusieurs explications circulent, aucune n'est établie avec certitude. Dans l'usage courant, elle désigne les populations d'origine européenne nées ou installées en Algérie française avant l'indépendance.",
          "Le cas des Juifs d'Algérie est particulier : citoyens français depuis 1870 par le décret Crémieux, ils partagent avec les autres pieds-noirs l'expérience de l'exil de 1962 et se reconnaissent souvent dans ce terme. Mais leur présence en Algérie est bien antérieure à la colonisation française de 1830 — parfois de plusieurs siècles — ce qui pousse certains à revendiquer une identité distincte de « Juifs d'Algérie », avec une histoire, une persécution (1940-1943) et une trajectoire propres. Les deux usages coexistent ; ce site ne tranche pas et emploie les deux selon le contexte.",
        ],
      },
    ],
  },
  {
    id: "methode",
    titre: "Sur la méthode",
    questions: [
      {
        id: "lire-arbre",
        question: "Comment lit-on cet arbre ? Que veulent dire les quatre statuts ?",
        reponse: [
          "Chaque information affichée sur ce site — une date, un lieu, un métier, un lien de parenté — porte l'un de ces quatre statuts, toujours visible : Prouvé (un acte ou une source primaire existe et est cité), Témoignage (transmis oralement dans la famille, non vérifié par un document), Hypothèse (plausible, mais explicitement non démontré), Inconnu (le trou est affiché, pas masqué).",
          "Chaque donnée « Prouvé » est cliquable vers sa source dans le registre. Aucune fiche ne masque ce qu'elle ne sait pas : la section « Ce qu'on ne sait pas encore », en bas de chaque fiche individuelle, liste explicitement les champs vides.",
        ],
      },
      {
        id: "cases-vides",
        question: "Pourquoi certaines cases sont-elles vides plutôt que remplies au plus probable ?",
        reponse: [
          "Parce qu'une estimation, même raisonnable, devient très vite indiscernable d'un fait une fois écrite noir sur blanc et recopiée d'arbre en arbre. C'est exactement le problème que ce site veut éviter (voir la question sur Geneanet). Un champ vide reste une invitation explicite à chercher ; un champ rempli « au plus probable » referme la question sans le dire.",
          "C'est pour cela que les dates inconnues de Jean Arrouasse et Josette Amsellem, par exemple, restent `null` dans les données tant qu'elles ne sont pas confirmées par un acte, même si un témoignage familial en donne une estimation — laquelle est alors affichée avec le statut « Témoignage », pas « Prouvé ».",
        ],
      },
      {
        id: "preuve-genealogie",
        question: "Qu'est-ce qui compte comme preuve en généalogie ?",
        reponse: [
          "Par ordre de fiabilité décroissante : un acte d'état civil original (naissance, mariage, décès) ou son extrait certifié ; un acte notarié ou une mention marginale contemporaine des faits ; un document administratif ou de presse d'époque, qui documente un fait sans nécessairement en garantir tous les détails (orthographe des noms, âges) ; un témoignage familial direct, précieux mais à recouper dès que possible ; enfin, un arbre en ligne non sourcé, qui ne constitue jamais une preuve en soi (voir la question suivante).",
          "Une preuve solide combine généralement plusieurs de ces éléments qui se recoupent, plutôt qu'une source unique prise isolément.",
        ],
      },
      {
        id: "geneanet-pas-preuve",
        question: "Pourquoi un arbre trouvé sur Geneanet n'est-il pas une preuve ?",
        reponse: [
          "Les arbres collaboratifs comme Geneanet sont des agrégations de contributions d'utilisateurs, très souvent recopiées d'un arbre à l'autre sans vérification de la source d'origine. Une erreur introduite une fois — une date mal lue, un lien de parenté supposé — peut ainsi se retrouver dans des dizaines d'arbres différents, ce qui donne une fausse impression de consensus alors qu'il ne s'agit que d'une même erreur répétée.",
          "Un arbre en ligne reste utile comme piste : il peut indiquer où chercher (un nom, une ville, une date approximative). Mais ce site ne cite jamais un arbre Geneanet comme source dans un `sourceIds` : seule la vérification de l'acte ou du document original permet de faire passer une information de « piste » à « prouvé ».",
        ],
      },
    ],
  },
  {
    id: "archives",
    titre: "Sur les archives",
    questions: [
      {
        id: "ou-etat-civil-algerie",
        question: "Où sont les archives de l'état civil d'Algérie, et jusqu'à quelle année ?",
        reponse: [
          "Les registres d'état civil de l'Algérie française, jusqu'à l'indépendance en 1962, sont conservés en France par les Archives nationales d'outre-mer (ANOM), à Aix-en-Provence, en grande partie numérisés et consultables en ligne. Pour les actes postérieurs à 1962, il faut s'adresser aux autorités algériennes actuelles, ou, pour les personnes de nationalité française, au Service central d'état civil de Nantes (voir la question suivante).",
        ],
      },
      {
        id: "scec-nantes",
        question: "Comment demander gratuitement un acte au Service central d'état civil de Nantes ?",
        reponse: [
          "Le Service central d'état civil (SCEC), à Nantes, détient notamment les actes concernant les Français nés, mariés ou décédés dans les anciens territoires français, dont l'Algérie avant 1962. La demande se fait gratuitement, en ligne sur service-public.fr ou par courrier, en précisant l'identité complète de la personne concernée, la date et le lieu approximatifs de l'événement, et le lien de parenté avec le demandeur.",
          "Attention : les actes de moins de 75 ans (mariages, décès) ou 100 ans (naissances) sont soumis à des règles de communicabilité restreintes, en général réservées au titulaire de l'acte ou à ses ascendants/descendants directs.",
        ],
      },
      {
        id: "anom",
        question: "Qu'est-ce que l'ANOM, et que peut-on y chercher soi-même ?",
        reponse: [
          "Les Archives nationales d'outre-mer, à Aix-en-Provence, conservent l'essentiel des archives de l'administration coloniale française, dont les registres d'état civil d'Algérie, des actes notariés, des archives foncières et une partie de la presse coloniale. Une grande partie de ces fonds est numérisée et consultable gratuitement en ligne, commune par commune et année par année.",
          "L'indexation nominative reste toutefois incomplète : chercher un nom précis demande souvent de parcourir les registres image par image sur la période et la commune plausibles, plutôt que de taper un nom dans un moteur de recherche. C'est un travail patient, mais accessible à qui n'est pas généalogiste professionnel.",
        ],
      },
      {
        id: "avant-1850",
        question: "Pourquoi est-il si difficile de remonter avant 1850 pour une famille juive d'Algérie ?",
        reponse: [
          "L'état civil français tel qu'on le connaît (registres systématiques de naissance, mariage, décès) ne se généralise en Algérie qu'après la conquête de 1830, et plus encore après le décret Crémieux de 1870. Avant cela, les événements familiaux étaient, quand ils l'étaient, enregistrés par les institutions communautaires juives elles-mêmes (registres religieux, tribunaux rabbiniques) plutôt que par une administration civile centralisée — l'administration ottomane ne tenait pas de registres d'état civil pour les populations non musulmanes de la même manière.",
          "Ces registres communautaires, quand ils ont existé, sont beaucoup moins bien conservés que les archives d'état civil françaises : au-delà du milieu du XIXe siècle, la recherche dépend donc de fonds rares et dispersés, quand ils n'ont pas simplement disparu.",
        ],
      },
      {
        id: "test-adn",
        question: "Un test ADN peut-il aider, et avec quelles limites ?",
        reponse: [
          "Un test ADN autosomique peut confirmer ou infirmer une hypothèse de parenté proche (jusqu'à 5-6 générations environ) et, surtout, révéler des cousins vivants inconnus — ce qui pourrait directement éclairer certaines questions ouvertes de ce site, comme le lien avec Serge ou Gérard Arrouasse.",
          "Deux limites importantes. D'abord, l'ADN ne donne ni dates ni lieux : il indique un degré de parenté probable, pas un acte de naissance — il complète la recherche d'archives, il ne la remplace pas. Ensuite, les populations juives séfarades, historiquement peu nombreuses et endogames, présentent un taux de parenté génétique de fond plus élevé que la moyenne : deux personnes peuvent apparaître comme « cousines » sur un test alors que leur ancêtre commun réel remonte à plusieurs siècles, ce qui complique l'interprétation des correspondances (« matches »).",
        ],
      },
    ],
  },
  {
    id: "vie-privee",
    titre: "Sur la vie privée",
    questions: [
      {
        id: "personnes-vivantes",
        question: "Pourquoi les personnes vivantes n'apparaissent-elles pas ?",
        reponse: [
          "Par principe : personne ne devrait voir son nom complet, ses dates ou les détails de sa vie publiés en ligne sans son consentement explicite, a fortiori pour des enfants mineurs. Ce site réduit donc automatiquement toute personne marquée comme vivante à une fiche minimale (« Personne vivante »), sans nom, ni date, ni détail — seule sa position dans l'arbre (branche) reste visible.",
          "Les données complètes existent dans le jeu de données pour l'usage généalogique familial, et peuvent être affichées intégralement en local via l'option de build réservée à cet usage hors ligne — jamais sur le site public.",
        ],
      },
      {
        id: "retrait-information",
        question: "Comment demander le retrait d'une information ?",
        reponse: [
          "Via la page Contribuer, en précisant l'information concernée et la raison de la demande. Toute demande de retrait ou de correction concernant une personne vivante, ou toute information que vous jugez erronée ou publiée par erreur, sera traitée en priorité.",
        ],
      },
    ],
  },
];
