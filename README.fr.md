# Fastify Prisma Better Auth Boilerplate

Un boilerplate complet pour démarrer rapidement un projet backend avec **Fastify**, **Prisma**, **Better Auth** et un système d'autorisation RBAC/ABAC avancé.

> 🇬🇧 [English version available here](./README.en.md)

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Features implémentées](#-features-implémentées)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Commandes disponibles](#-commandes-disponibles)
- [ESLint, Prettier & Husky](#-eslint-prettier--husky)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Technologies utilisées](#-technologies-utilisées)

## 🎯 Vue d'ensemble

Ce boilerplate fournit une base solide pour développer des APIs REST modernes avec :

- **TypeScript** : Type-safety complet
- **Fastify** : Framework web ultra-performant
- **Prisma** : ORM moderne avec migrations et type-safety
- **Better Auth** : Authentification complète (email/password, OAuth, sessions)
- **RBAC/ABAC** : Système d'autorisation avec rôles, permissions et policies
- **Multi-tenancy** : Support d'organisations avec isolation des données
- **Monitoring** : Endpoints de health check et version
- **Maintenance Mode** : Mode maintenance activable dynamiquement
- **Logging avancé** : Correlation ID pour le traçage des requêtes
- **Qualité de code** : ESLint, Prettier, Husky et lint-staged pré-configurés

## ✨ Features implémentées

### 1. 🔐 Authentification (Better Auth)

Système d'authentification complet basé sur [Better Auth](https://www.better-auth.com/) :

- **Inscription/Connexion** : Email + password avec hashage sécurisé
- **Vérification d'email** : Système de tokens de vérification
- **Sessions** : Gestion des sessions utilisateur avec tokens
- **Reset password** : Flow de réinitialisation de mot de passe
- **OAuth** : Support pour providers externes (configurable)
- **Accounts liés** : Plusieurs méthodes d'authentification par utilisateur

**Endpoints disponibles** :

- `POST /api/auth/sign-up/email` - Créer un compte
- `POST /api/auth/sign-in/email` - Se connecter
- `POST /api/auth/sign-out` - Se déconnecter
- `GET /api/auth/get-session` - Récupérer la session actuelle
- `POST /api/auth/send-verification-email` - Envoyer le message de vérification
- `GET /api/auth/list-accounts` - Lister les comptes d'authentification associé à l'utilisateur
- `POST /api/auth/update-user` - Mettre à jour les données d'un utilisateur
- `POST /auth/verify-email` - Vérifier l'email
- `POST /api/auth/request-password-reset` - Réinitialiser le mot de passe
- `GET /api/auth/ok` - Vérifier l'état de l'authentification

### 2. 🔒 Autorisation (RBAC/ABAC)

TBD

#### **RBAC (Role-Based Access Control)**

- **Rôles** : Définition de rôles personnalisés par organisation ou globaux
- **Permissions** : Permissions granulaires (ex: `invoice.create`, `order.update`)
- **Héritage de rôles** : Les rôles peuvent hériter d'autres rôles
- **Multi-tenancy** : Rôles scopés par organisation

#### **ABAC (Attribute-Based Access Control)**

- **Policies** : Règles d'accès dynamiques basées sur JSONLogic
- **Contexte** : Évaluation des permissions avec contexte (userId, organizationId, resource, etc.)
- **Évaluation** : Fonction `userCan()` et `assertUserCan()` pour vérifier les permissions

**Schéma de données** :

```
User → RoleMembership → Role → RolePermission → Permission
                                              ↘ Policy (optionnel)
```

**Utilisation (Toujours en développement)** :

```typescript
import { userCan, assertUserCan } from './modules/authz';

// Vérifier si l'utilisateur peut effectuer une action
const canCreate = await userCan(userId, 'invoice.create', { organizationId: 'org123' });

// Lever une erreur si l'utilisateur ne peut pas
await assertUserCan(userId, 'invoice.create', { organizationId: 'org123' });
```

### 3. 🏢 Multi-tenancy (Organizations)

Support complet pour les applications multi-tenants :

- **Organizations** : Groupes isolés d'utilisateurs
- **Memberships** : Relation entre utilisateurs et organisations
- **Rôles scopés** : Rôles différents par organisation
- **Isolation des données** : Modèle de données préparé pour l'isolation

### 4. 📊 Monitoring

Endpoints de monitoring pour supervision et health checks :

**Endpoints** :

- `GET /monitoring/health` - Statut de l'application et de la base de données
- `GET /monitoring/version` - Version de l'application et uptime

**Exemple de réponse** :

```json
{
    "status": "OK",
    "details": {
        "database": "OK"
    }
}
```

### 5. 🔧 Mode Maintenance

Plugin pour activer/désactiver le mode maintenance :

- **Routes ignorées** : Les routes de maintenance et monitoring ne sont pas bloquées
- **Activation dynamique** : Peut être activé/désactivé sans redémarrage
- **Message personnalisable** : Erreur 503 avec message de maintenance

**Endpoints** :

- `POST /maintenance` - Activer/désactiver le mode maintenance
- `GET /maintenance` - Vérifier l'état du mode maintenance

**Utilisation** :

```typescript
// Activer le mode maintenance
app.maintenance.enabled = true;

// Désactiver le mode maintenance
app.maintenance.enabled = false;
```

### 6. 📝 Logging & Correlation

Système de logging avancé avec traçabilité :

- **Pino logger** : Logger haute performance
- **Correlation ID** : ID unique par requête pour tracer les logs
- **Contexte AsyncLocalStorage** : Propagation automatique du correlation ID, extensible pour d'autres variables de contexte
- **Logs structurés** : Format JSON pour faciliter l'analyse

**Fonctionnement** :

- Chaque requête reçoit un `x-correlation-id` (ou en génère un)
- Le correlation ID est ajouté à tous les logs de la requête
- Permet de tracer une requête à travers tous les logs

### 7. 🗄️ Base de données (Prisma)

ORM Prisma avec schémas multi-schemas PostgreSQL :

- **3 schémas** :
    - `core` : Utilisateurs, sessions, accounts, vérifications
    - `authz` : Organisations, rôles, permissions, policies
    - `audit` : Logs d'accès et d'audit
- **Migrations** : Système de migrations automatique
- **Type-safety** : Modèles TypeScript générés automatiquement
- **Relations** : Relations complexes entre modèles
- **Seeding** : TBD

### 8. 🌍 CORS & Security

Plugins de sécurité préconfigurés :

- **CORS** : Configuration CORS pour autoriser les requêtes cross-origin
- **Helmet** : Headers de sécurité HTTP (CSP, HSTS, etc.)

### 9. ⚙️ Configuration typée

Système de configuration avec validation Zod :

- **Variables d'environnement** : Validation stricte au démarrage
- **Type-safety** : Configuration entièrement typée
- **Erreurs claires** : Messages d'erreur détaillés si config invalide

**Variables requises** :

```env
NODE_ENV=dev|prod
PORT=3000
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
```

### 10. 🎯 Gestion d'erreurs centralisée

Handler d'erreurs global et cohérent :

- **Erreurs personnalisées** : Classes d'erreurs typées (`CustomError`, `DatabaseError`, `MaintenanceError`)
- **Codes d'erreur** : Codes standardisés (ex: `AUTH_001`, `DB_001`)
- **Prisma errors** : Gestion automatique des erreurs Prisma
- **Logging** : Toutes les erreurs sont loggées avec contexte
- **Réponses JSON** : Format d'erreur standardisé

**Format de réponse** :

```json
{
    "status": 400,
    "code": "AUTH_001",
    "message": "Invalid credentials",
    "details": {}
}
```

### 11. 🐳 Docker (TBD)

## 🚀 Installation

### Prérequis

- **Node.js** : v18 ou supérieur
- **npm** ou **pnpm** ou **yarn**
- **PostgreSQL** : v13 ou supérieur
- **Docker** (optionnel) : pour lancer PostgreSQL en local

### Étapes

1. **Cloner le repository** :

```bash
git clone <repo-url>
cd fastify-prisma-better-auth
```

2. **Installer les dépendances** :

```bash
npm install
```

3. **Configurer les variables d'environnement** :

```bash
cp .env.example .env
# Éditer .env avec vos valeurs, le .env.example contient la configuration minimale.
# L'ensemble des paramètres de configuration possible sont définis dans './src/config/config-schema.ts'
```

4. **Lancer PostgreSQL** (avec Docker) :

```bash
docker-compose up -d
```

5. **Générer le client Prisma** :

```bash
npx prisma generate
```

6. **Lancer les migrations** :

```bash
npx prisma migrate dev
```

7. **Démarrer le serveur** :

```bash
npm run dev
```

L'API sera accessible sur `http://localhost:3000`

## 📦 Commandes disponibles

### Scripts npm

#### Développement

```bash
# Démarrer en mode développement (hot reload)
npm run dev

# Construire le projet
npm run build

# Démarrer en production (après build)
npm start
```

#### Qualité de code

```bash
# Linter le code
npm run lint

# Linter et corriger automatiquement
npm run lint:fix

# Formater le code avec Prettier
npm run format

# Vérifier le formatage (CI)
npm run format:check
```

#### Tests

```bash
# Lancer les tests (TBD)
npm test
```

### Commandes Prisma

#### Migrations

```bash
# Créer une nouvelle migration et l'appliquer
npx prisma migrate dev --name <nom-migration>

# Appliquer les migrations en production
npx prisma migrate deploy

# Réinitialiser la base de données (DEV ONLY)
npx prisma migrate reset

# Vérifier l'état des migrations
npx prisma migrate status
```

#### Client Prisma

```bash
# Générer le client Prisma (après changement du schema)
npx prisma generate

# Formater le fichier schema.prisma
npx prisma format
```

#### Base de données

```bash
# Pousser le schema sans créer de migration (prototyping)
npx prisma db push

# Ouvrir Prisma Studio (interface graphique)
npx prisma studio

# Seeder la base de données (si seed script configuré)
npx prisma db seed
```

## 🎨 ESLint, Prettier & Husky

### ESLint

Configuration ESLint pour TypeScript avec règles strictes.

**Configuration** (`eslint.config.js`) :

- Parser TypeScript avec support du projet
- Plugin `@typescript-eslint` pour les règles TS
- Plugin `import` pour gérer les imports
- Intégration avec Prettier (pas de conflits)
- Ignore des fichiers générés (`src/generated/`, `dist/`)

**Règles principales** :

- `@typescript-eslint/no-explicit-any: warn` - Éviter `any`
- `import/order` - Trier les imports avec ligne vide entre groupes
- `@typescript-eslint/no-unused-vars` - Variables non utilisées (ignore `_` prefix)

**Utilisation** :

```bash
# Linter tout le projet
npm run lint

# Corriger automatiquement
npm run lint:fix
```

### Prettier

Formatage automatique du code pour un style cohérent.

**Configuration** (`.prettierrc`) :

```json
{
    "trailingComma": "es5",
    "semi": true,
    "singleQuote": true,
    "tabWidth": 4,
    "printWidth": 100
}
```

**Utilisation** :

```bash
# Formater tous les fichiers
npm run format

# Vérifier le formatage (sans modifier)
npm run format:check
```

### Husky & lint-staged

Hooks Git pour garantir la qualité du code avant commit.

#### Configuration Husky

**Installation** :

```bash
npm run prepare
```

Cela installe les hooks Git dans `.husky/`.

**Hook pre-commit** (`.husky/pre-commit`) :

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

#### Configuration lint-staged

Dans `package.json` :

```json
{
    "lint-staged": {
        "*.{ts,js}": ["eslint --cache --fix", "prettier --write"],
        "*.{json,md,css}": ["prettier --write"]
    }
}
```

**Ce qui se passe au commit** :

1. Husky intercepte le `git commit`
2. Lance `lint-staged`
3. lint-staged :
    - Lint et corrige les fichiers `.ts` et `.js`
    - Formate avec Prettier
    - Formate les fichiers JSON, Markdown, CSS
4. Si erreurs, le commit est bloqué

#### Setup complet (pour nouveau projet)

Si vous partez de zéro, voici comment tout configurer :

```bash
# 1. Installer les dépendances
npm install -D husky lint-staged eslint prettier \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-config-prettier \
  eslint-plugin-import

# 2. Initialiser Husky
npx husky install

# 3. Créer le hook pre-commit
npx husky add .husky/pre-commit "npx lint-staged"

# 4. Créer .prettierrc
echo '{
  "trailingComma": "es5",
  "semi": true,
  "singleQuote": true,
  "tabWidth": 4,
  "printWidth": 100
}' > .prettierrc

# 5. Créer eslint.config.js (voir fichier existant)

# 6. Ajouter lint-staged dans package.json
npm pkg set lint-staged='{"*.{ts,js}":["eslint --cache --fix","prettier --write"],"*.{json,md,css}":["prettier --write"]}'
```

**Désactiver temporairement** :

```bash
# Skip les hooks pour un commit (non recommandé)
git commit --no-verify -m "message"

# Désactiver Husky temporairement
export HUSKY=0
git commit -m "message"
```

## 🎮 Utilisation

### Exemple : Vérifier les permissions

### Exemple : Mode maintenance

```typescript
// Activer le mode maintenance
app.maintenance.enabled = true;
app.maintenance.startTime = new Date();

// Toutes les routes (sauf /maintenance et /monitoring) retourneront une erreur 503
```

## 📁 Structure du projet

```
fastify-prisma-better-auth/
├── src/
│   ├── index.ts                    # Point d'entrée
│   ├── server.ts                   # Configuration Fastify
│   ├── config/                     # Configuration & validation
│   │   ├── config-schema.ts
│   │   ├── correlation-logger.ts
│   │   └── index.ts
│   ├── errors/                     # Gestion d'erreurs
│   │   ├── custom-error.ts
│   │   ├── database-error.ts
│   │   ├── error-codes.ts
│   │   ├── maintenance-error.ts
│   │   └── catch-handlers/
│   │       └── prisma-error-handler.ts
│   ├── middlewares/                # Middlewares globaux
│   │   └── error-handler.ts
│   ├── modules/                    # Modules fonctionnels
│   │   ├── auth/                   # Authentification (Better Auth)
│   │   │   ├── auth.plugin.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   └── index.ts
│   │   ├── authz/                  # Autorisation (RBAC/ABAC)
│   │   │   ├── cache.ts
│   │   │   ├── evaluator.ts
│   │   │   ├── policy.ts
│   │   │   ├── rbac.ts
│   │   │   ├── types.ts
│   │   │   └── services/
│   │   ├── maintenance/            # Mode maintenance
│   │   │   ├── maintenance.plugin.ts
│   │   │   ├── maintenance.route.ts
│   │   │   └── dto/
│   │   └── monitoring/             # Health checks
│   │       ├── monitoring.plugin.ts
│   │       ├── monitoring.route.ts
│   │       └── monitoring.service.ts
│   ├── plugins/                    # Plugins Fastify
│   │   ├── config.ts
│   │   ├── correlation-plugin.ts
│   │   ├── cors.ts
│   │   ├── prisma.ts
│   │   └── index.ts
│   ├── utils/                      # Utilitaires
│   │   └── context.ts
│   └── generated/                  # Généré par Prisma
│       └── prisma/
├── prisma/
│   ├── schema.prisma               # Schéma de base de données
│   ├── migrations/                 # Migrations
│   └── seeding/                    # Seeds (à implémenter)
├── bruno/                          # Collection Bruno (tests API)
│   └── fpauth/
├── .husky/                         # Hooks Git
│   ├── pre-commit
│   └── _/
├── docker-compose.yml              # Docker Compose (PostgreSQL)
├── Dockerfile                      # Image Docker de l'app
├── eslint.config.js                # Configuration ESLint
├── .prettierrc                     # Configuration Prettier
├── tsconfig.json                   # Configuration TypeScript
├── package.json
└── README.md
```

## 🛠️ Technologies utilisées

### Core

- **[Fastify](https://fastify.dev/)** (v5.6) - Framework web haute performance
- **[TypeScript](https://www.typescriptlang.org/)** (v5.9) - Typage statique
- **[Prisma](https://www.prisma.io/)** (v6.19) - ORM moderne
- **[Better Auth](https://www.better-auth.com/)** (v1.3) - Authentification

### Sécurité & Middleware

- **[@fastify/cors](https://github.com/fastify/fastify-cors)** - CORS
- **[@fastify/helmet](https://github.com/fastify/fastify-helmet)** - Headers de sécurité
- **[Zod](https://zod.dev/)** - Validation de schéma

### Autorisation

- **[json-logic-js](https://github.com/jwadhams/json-logic-js)** - Évaluation de policies

### Logging

- **[Pino](https://getpino.io/)** - Logger haute performance (inclus dans Fastify)
- **[pino-pretty](https://github.com/pinojs/pino-pretty)** - Pretty print pour dev

### Qualité de code

- **[ESLint](https://eslint.org/)** (v9.39) - Linter
- **[@typescript-eslint](https://typescript-eslint.io/)** - Règles TypeScript pour ESLint
- **[Prettier](https://prettier.io/)** (v3.6) - Formatage de code
- **[Husky](https://typicode.github.io/husky/)** (v9.1) - Hooks Git
- **[lint-staged](https://github.com/okonet/lint-staged)** - Lint sur fichiers stagés

### Développement

- **[tsx](https://github.com/privatenumber/tsx)** - Exécution TypeScript avec hot reload
- **[dotenv](https://github.com/motdotla/dotenv)** - Variables d'environnement

### Infrastructure

- **[Docker](https://www.docker.com/)** - Containerisation
- **[PostgreSQL](https://www.postgresql.org/)** (v18) - Base de données

---

## 📚 Ressources

- [Documentation Fastify](https://fastify.dev/docs/latest/)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Better Auth](https://www.better-auth.com/docs)
- [Bruno API Client](https://www.usebruno.com/)

## 📄 Licence

ISC

## 👥 Auteur

William ISABELLE - Heksa SD
