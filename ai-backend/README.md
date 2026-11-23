# Backend de facturation — SQLite

API Express et TypeScript : Gemini utilise l'outil `get-facturation` pour lire
les factures dans SQLite via `better-sqlite3`.

## Installation et lancement

Depuis ce dossier, avec Node.js 22.22 ou une version compatible plus récente :

```sh
npm install
npm run dev
```

Créer un `.env` à la racine du dépôt à partir de `.env.example` si nécessaire,
puis renseigner `GOOGLE_GENERATIVE_AI_API_KEY`. Le nom existant `GOOGLE_KEY`
est également accepté. Les variables du processus sont prioritaires sur
le fichier `.env` à la racine.

```dotenv
GOOGLE_GENERATIVE_AI_API_KEY=votre_cle_google
DATABASE_URL=./data/facturation.db
```

`DATABASE_URL` désigne un fichier SQLite, pas un serveur PostgreSQL.
Utiliser un chemin de fichier sans préfixe `file:` et lancer le serveur depuis
`ai-backend` : les chemins relatifs dépendent du dossier de lancement.
Un chemin absolu ou `:memory:` sont aussi acceptés.
Sans cette variable, le chemin est `./data/facturation.db`.

Le dossier et les tables `client` et `facture` sont créés automatiquement.
Si la table des clients est vide, deux clients et trois factures de démonstration
sont insérés dans une transaction. Les données existantes sont conservées.
Les clés étrangères sont activées et les fichiers SQLite sont ignorés par Git.
Aucune migration des données PostgreSQL n'est effectuée.

## API

Envoyer `POST http://localhost:3000/api/chat` avec un corps JSON :

```json
{ "message": "Quelles sont les factures de Jean Dupont ?" }
```

La réponse contient un champ `response`. L'appel à Gemini nécessite une clé
Google valide et un accès réseau. Les données de démonstration donnent deux
factures pour Jean Dupont, pour un total de 350.

## Vérifications

```sh
npm test
npm run start
```

`npm test` compile TypeScript puis vérifie SQLite, la recherche de factures,
les clés étrangères et la persistance, sans appel à Gemini.
`npm run build` compile seul ; `npm start` lance le code compilé.
