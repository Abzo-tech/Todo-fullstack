# Documentation de l'API ToDo

## 1. Présentation Générale

L'application ToDo est une API REST construite avec Express.js et TypeScript, utilisant Prisma comme ORM pour une base de données MySQL. Elle permet la gestion sécurisée des tâches avec authentification JWT.

---

## 2. Architecture

### 2.1 Point d'entrée (`src/index.ts`)

- Configuration du serveur Express
- Middleware JSON
- Routes principales : `/tasks`, `/users`, `/auth`
- Middleware 404

### 2.2 Authentification

- JWT avec middleware `authenticateJWT`
- Routes : `/auth/login`, `/auth/register`
- Validation du token dans l'en-tête Authorization

### 2.3 Gestion des Tâches

- Routes protégées par authentification
- Endpoints CRUD et toggle complétion
- Validation des données avec Zod
- Association automatique des tâches à l'utilisateur connecté

### 2.4 Base de données (Prisma)

- Modèles : User, Task, TaskShare
- Relations entre utilisateurs et tâches
- Permissions de partage (READ, WRITE, DELETE)

---

## 3. Détails Techniques

### 3.1 Routes

- `src/routes/TaskRoute.ts` : gestion des tâches
- `src/routes/AuthRoute.ts` : gestion de l'authentification

### 3.2 Contrôleurs

- `src/controllers/TaskController.ts` : logique des endpoints tâches
- Validation des entrées, gestion des erreurs

### 3.3 Services

- `src/services/TaskService.ts` : logique métier des tâches
- Appel aux repositories

### 3.4 Repositories

- `src/repositories/TodoRepository.ts` : accès à la base via Prisma
- Opérations CRUD, toggle complétion

### 3.5 Middleware

- `src/middleware/authMiddleware.ts` : authentification JWT

---

## 4. Données de Test

### 4.1 Fichier `test_data.txt`

- Structure simple des utilisateurs et tâches pour tests manuels

### 4.2 Fichier `test_data_seed.js`

- Script complet pour peupler la base avec :
  - 5 utilisateurs (USER et ADMIN)
  - 12 tâches variées
  - 3 partages de tâches avec permissions

### 4.3 Utilisation du seed

```bash
npx tsx test_data_seed.js
# ou
npx ts-node test_data_seed.js
```

---

## 5. Comptes de Test

| Nom           | Email                     | Mot de passe  | Rôle  |
|---------------|---------------------------|--------------|-------|
| Alice Dupont  | alice.dupont@example.com  | password123  | USER  |
| Jean Martin   | jean.martin@example.com   | password123  | ADMIN |
| Marie Leroy   | marie.leroy@example.com   | password123  | USER  |
| Pierre Durand | pierre.durand@example.com | password123  | USER  |
| Sophie Moreau | sophie.moreau@example.com | password123  | USER  |

---

## 6. Instructions Complémentaires

- Le seed supprime les données existantes avant insertion
- Les mots de passe sont hashés avec bcrypt
- Les partages de tâches permettent de tester les permissions

---

## 7. Suggestions pour Tests

- Tester tous les endpoints CRUD des tâches
- Tester l'authentification et la gestion des tokens
- Vérifier la gestion des erreurs et validations
- Tester les partages de tâches et permissions

---

## 8. Notes

Cette documentation synthétise les échanges et les fichiers créés lors de la session. Elle peut être enrichie avec des exemples de requêtes, réponses, et instructions de déploiement.

---

*Document généré automatiquement par BLACKBOXAI*
