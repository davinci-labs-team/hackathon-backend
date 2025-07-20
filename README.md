# Mon Application NestJS

Une application NestJS avec Supabase et Prisma.

## Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Compte Supabase
- Base de données PostgreSQL

## Installation

1. Clonez le repository :
```bash
git clone <votre-repo>
cd <nom-du-projet>
```

2. Installez les dépendances :
```bash
npm install
```

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Supabase Configuration
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre_cle_publique_supabase
SUPABASE_JWT_SECRET=votre_secret_jwt_supabase

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Tokens de rafraîchissement
REFRESH_TOKEN1=votre_refresh_token_1
REFRESH_TOKEN2=votre_refresh_token_2
```

### Récupération des clés Supabase

1. Connectez-vous à votre [dashboard Supabase](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez :
   - **URL** : `SUPABASE_URL`
   - **anon public** : `SUPABASE_KEY`
   - **JWT Secret** : `SUPABASE_JWT_SECRET`

## Setup de la base de données

1. Générez le client Prisma :
```bash
npx prisma generate
```

2. Appliquez les migrations (si nécessaire) :
```bash
npx prisma db push
```

## Démarrage de l'application

### Mode développement
```bash
npm run start:dev
```

### Mode production
```bash
npm run build
npm run start:prod
```

## Scripts disponibles

- `npm run start` - Démarre l'application
- `npm run start:dev` - Démarre en mode développement avec hot reload
- `npm run start:prod` - Démarre en mode production
- `npm run build` - Build l'application
- `npm run test` - Lance les tests
- `npm run lint` - Vérifie le code avec ESLint
- `npm run format` - Formate le code avec Prettier

- `./scripts/signup_supabase.sh` - Crée un utilisateur dans l'authentificateur et retourne le token
- `./scripts/refresh_token_supabase.sh` - Utilise le refresh token pour récupérer un nouveau token

## Structure du projet

```
src/
├── modules/          # Modules de l'application
├── common/           # Utilitaires partagés
└── main.ts          # Point d'entrée

prisma/
├── schema.prisma     # Schéma de la base de données
└── migrations/       # Migrations
```

## Technologies utilisées

- [NestJS](https://nestjs.com/) - Framework Node.js
- [Prisma](https://www.prisma.io/) - ORM pour la base de données
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [PostgreSQL](https://www.postgresql.org/) - Base de données

## Support

Pour toute question ou problème, veuillez ouvrir une issue dans le repository.