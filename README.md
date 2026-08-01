# Généalogie Arrouasse · Amsellem

Site de généalogie familiale : la ligne paternelle Arrouasse (Tlemcen) et
Amsellem–Benchetrit (Alger), familles juives séfarades pieds-noirs d'Algérie
arrivées en France en 1962.

Ce document explique comment **ajouter une personne** et **enregistrer la
modification (« commit »)**, sans connaissances techniques. Si un mot vous
semble obscur, cherchez-le dans le lexique en bas de page.

## Le principe, en une phrase

Tout ce que le site affiche vient de petits fichiers texte rangés dans le
dossier `src/data/`. Modifier le site, c'est modifier ces fichiers, puis
« envoyer » la modification pour qu'elle apparaisse en ligne.

## Ajouter une personne

1. Ouvrez le dossier `src/data/personnes/`. Chaque fichier `.json` y est une
   personne.
2. Repérez une fiche qui ressemble à ce que vous voulez créer (par exemple
   `src/data/personnes/arrouasse-jean.json` pour un couple dont la date de
   naissance n'est pas connue) et ouvrez-la pour vous en inspirer.
3. Créez un nouveau fichier dans ce même dossier. Le nom du fichier doit être
   l'identifiant de la personne, en minuscules, avec des tirets, par exemple
   `arrouasse-pierre-1955.json`.
4. Copiez la structure ci-dessous dans ce nouveau fichier et remplissez les
   champs que vous connaissez. **Laissez `null` tout ce que vous ne savez
   pas** — ne devinez jamais une date ou un lieu : le site est justement conçu
   pour afficher honnêtement ce qu'on ignore encore.

```json
{
  "id": "arrouasse-pierre-1955",
  "nom": "ARROUASSE",
  "prenoms": ["Pierre"],
  "prenomUsuel": null,
  "prenomHebraique": null,
  "variantesGraphiques": null,
  "sexe": "M",
  "naissance": {
    "type": "naissance",
    "date": "1955-03-12",
    "dateTexte": null,
    "lieuId": null,
    "notes": null,
    "statut": "temoignage",
    "sourceIds": ["temoignage-famille-laurent-arrouasse"]
  },
  "mariages": null,
  "deces": null,
  "professions": null,
  "pereId": null,
  "mereId": null,
  "conjointIds": null,
  "enfantIds": null,
  "branche": "arrouasse",
  "vivant": true,
  "notes": null,
  "statut": "temoignage",
  "sourceIds": ["temoignage-famille-laurent-arrouasse"]
}
```

### Les règles à respecter

- **`statut`** doit être `"prouve"`, `"temoignage"`, `"hypothese"` ou
  `"inconnu"`. N'utilisez `"prouve"` que si vous avez un vrai document (acte,
  article) à citer dans `sourceIds` — sinon le site refusera de se
  reconstruire avec un message d'erreur.
- **`sourceIds`** est la liste des sources qui appuient cette fiche. Si vous
  n'avez qu'un souvenir de famille, utilisez
  `["temoignage-famille-laurent-arrouasse"]` comme dans l'exemple. Si vous
  avez un vrai document, voir plus bas comment créer une nouvelle source.
- **`vivant`** doit être `true` pour toute personne encore en vie. Le site
  masque automatiquement son nom et ses dates sur la version publique.
- **`branche`** est `"arrouasse"`, `"amsellem"`, `"benchetrit"` ou `"alliee"`
  (pour quelqu'un qui a épousé la famille sans en être issu par le nom).
- **`pereId` / `mereId` / `conjointIds` / `enfantIds`** contiennent les
  identifiants (le nom de fichier sans `.json`) d'autres personnes déjà
  créées. Si la personne n'existe pas encore dans le site, laissez `null` et
  revenez compléter le lien plus tard.

### Ajouter une source

Si vous avez un vrai document (acte, article de journal, photo légendée),
créez un fichier dans `src/data/sources/`, par exemple
`src/data/sources/acte-naissance-pierre-arrouasse-1955.json` :

```json
{
  "id": "acte-naissance-pierre-arrouasse-1955",
  "titre": "Acte de naissance de Pierre Arrouasse, 12 mars 1955",
  "type": "acte_naissance",
  "cote": null,
  "depot": "Mairie de Lyon",
  "lien": null,
  "date": "1955-03-12",
  "notes": null
}
```

Puis citez son `id` (ici `acte-naissance-pierre-arrouasse-1955`) dans le
`sourceIds` de la fiche personne, et passez son `statut` à `"prouve"`.

## Vérifier avant d'envoyer

Si vous êtes à l'aise avec un terminal, lancez :

```
npm run validate:data
```

Cette commande relit toutes les fiches et vous dit clairement ce qui ne va
pas (faute de frappe, source manquante, statut incohérent) avant que la
modification ne parte en ligne. Si vous ne savez pas utiliser un terminal,
ne vous en faites pas : le site refusera aussi de se construire en ligne si
une fiche est incorrecte, et l'erreur apparaîtra dans l'historique GitHub.

## Enregistrer la modification (« commit ») et l'envoyer

### Option simple : directement sur GitHub, dans le navigateur

1. Allez sur la page du projet sur GitHub.
2. Ouvrez le dossier `src/data/personnes/` (ou `sources/`).
3. Cliquez sur **Add file → Create new file** (ou, pour modifier une fiche
   existante, ouvrez-la puis cliquez sur l'icône crayon).
4. Collez ou modifiez le contenu JSON.
5. Tout en bas de la page, écrivez une courte description de ce que vous
   avez fait (par exemple : « Ajout de Pierre Arrouasse »), puis cliquez sur
   **Commit changes** (ou **Propose changes**).

C'est tout : la modification part automatiquement reconstruire le site.

### Option terminal, pour les plus à l'aise

```
git add src/data/personnes/arrouasse-pierre-1955.json
git commit -m "Ajout de Pierre Arrouasse"
git push
```

## Les personnes vivantes

Par défaut, **ce site affiche toute la famille, personnes vivantes
comprises**, avec leurs prénoms et leurs dates de naissance. C'est un choix
délibéré : sans cela, les générations récentes n'apparaîtraient que sous la
mention « Personne vivante » et l'arbre serait illisible.

Conséquence à connaître : ces informations (y compris celles des enfants
mineurs) sont visibles par toute personne qui a l'adresse du site, et les
moteurs de recherche peuvent les indexer.

### Revenir à un site anonymisé

Si vous changez d'avis, une seule option suffit — aucune donnée n'est
perdue, les fiches restent intactes, seul l'affichage change :

```
PRIVATE_MODE=true npm run build
```

Toute personne `vivant: true` devient alors une fiche « Personne vivante »
sans nom ni date. Pour que ce soit permanent sur le site en ligne, il faut
ajouter cette variable d'environnement dans les réglages de Netlify ou de
Vercel (section « Environment variables »).

### Voir le site sur votre ordinateur

```
npm install
npm run dev
```

Puis ouvrez l'adresse affichée dans le terminal (en général
`http://localhost:4321`).

## Autres commandes utiles

| Commande | À quoi ça sert |
|---|---|
| `npm run dev` | Lance le site en local pour prévisualiser vos changements |
| `npm run build` | Reconstruit le site complet (comme le fera GitHub) |
| `npm run validate:data` | Vérifie toutes les fiches sans reconstruire tout le site |
| `npm run export:gedcom -- export.ged` | Exporte toutes les données au format GEDCOM, pour les importer dans Geneanet ou Heredis |
| `npm run import:gedcom -- fichier.ged` | Importe un fichier GEDCOM et crée les fiches JSON correspondantes dans `src/data/` |

## Lexique

- **JSON** : un format de fichier texte très simple, avec des `"champs":
  valeur` entre accolades. Chaque fiche personne ou source du site est un
  fichier JSON.
- **Commit** : l'action d'enregistrer une modification dans l'historique du
  projet, avec une courte description.
- **Push** : l'action d'envoyer vos commits vers GitHub pour qu'ils soient
  pris en compte.
- **Build** : la reconstruction automatique du site à partir des fichiers de
  données, qui vérifie au passage que tout est cohérent.
- **GEDCOM** : un format d'échange standard entre logiciels de généalogie
  (Geneanet, Heredis, etc.).

## Pour aller plus loin (développeurs)

- **Stack** : Astro + TypeScript, sortie statique, Tailwind CSS avec des
  tokens de design personnalisés (voir `tailwind.config.mjs`), validation
  Zod (`src/lib/schema.ts`).
- **Données** : `src/data/personnes/*.json`, `src/data/sources/*.json`,
  `src/data/lieux.json`, `src/data/evenements.json` (contexte historique).
  Aucune base de données ; tout est versionné dans Git.
- **PRIVATE_MODE** : par défaut, le site affiche toute la famille, personnes
  vivantes comprises (choix explicite du propriétaire du site).
  `PRIVATE_MODE=true` réduit toute personne `vivant: true` à une fiche
  « Personne vivante » sans nom ni date. Le drapeau n'agit qu'au rendu : les
  fiches JSON restent inchangées.
- **GEDCOM** : `scripts/export-gedcom.ts` / `scripts/import-gedcom.ts`,
  logique commune dans `scripts/gedcom-lib.ts`. Le format GEDCOM ne connaît
  pas nativement nos quatre statuts : ils sont encodés via le champ `QUAY`
  (qualité de source, 0 à 3) et des tags personnalisés `_STATUT`, `_BRANCHE`,
  `_VIVANT`, `_ID`, préfixés par un underscore comme le permet la norme
  GEDCOM pour les extensions.
- **Déploiement** : `npm run build` produit un dossier `dist/` statique,
  déployable tel quel sur Netlify ou Vercel (aucun backend requis).
