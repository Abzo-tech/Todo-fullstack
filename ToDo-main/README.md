# 🚀 API ToDo - Guide de démarrage rapide

Une API REST complète pour la gestion de tâches avec authentification JWT, construite avec Express.js, TypeScript et Prisma.

## 📋 Prérequis

- **Node.js** version 16 ou supérieure
- **npm** (inclus avec Node.js)
- **MySQL** ou **PostgreSQL** (configuré dans `.env`)

## ⚡ Démarrage rapide

### Option 1: Script automatique (Recommandé)

1. **Rendre le script exécutable :**
   ```bash
   chmod +x setup.sh
   ```

2. **Lancer la configuration complète :**
   ```bash
   ./setup.sh
   ```

   Le script va automatiquement :
   - ✅ Vérifier les prérequis
   - 📦 Installer les dépendances
   - 🗄️ Configurer la base de données
   - 🌱 Peupler avec des données de test
   - 🚀 Démarrer le serveur

### Option 2: Configuration manuelle

Si vous préférez configurer étape par étape :

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la base de données
npx prisma generate
npx prisma db push

# 3. Peupler avec des données de test (optionnel)
npx tsx test_data_seed.js

# 4. Démarrer le serveur
npm run dev
```

## 🔧 Utilisation du script setup.sh

### Commandes disponibles

```bash
# Configuration complète avec données de test
./setup.sh

# Configuration sans données de test
./setup.sh --skip-seed

# Afficher l'aide
./setup.sh --help
```

### Options du script

- `-h, --help` : Afficher l'aide
- `-s, --skip-seed` : Passer le peuplement des données de test
- `-d, --dev` : Mode développement (défaut)
- `-p, --prod` : Mode production

## 🌐 Accès à l'API

Une fois démarré, l'API est accessible sur :
```
http://localhost:3000
```

## 👥 Comptes de test

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| alice.dupont@example.com | password123 | USER |
| jean.martin@example.com | password123 | ADMIN |
| marie.leroy@example.com | password123 | USER |
| pierre.durand@example.com | password123 | USER |
| sophie.moreau@example.com | password123 | USER |

## 📚 Endpoints principaux

### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription

### Tâches (nécessitent un token JWT)
- `GET /tasks` - Lister les tâches
- `POST /tasks` - Créer une tâche
- `GET /tasks/:id` - Obtenir une tâche
- `PUT /tasks/:id` - Modifier une tâche
- `DELETE /tasks/:id` - Supprimer une tâche
- `PATCH /tasks/:id/toggle` - Basculer l'état complété

## 🗂️ Structure du projet

```
├── src/
│   ├── controllers/     # Contrôleurs des endpoints
│   ├── services/        # Logique métier
│   ├── repositories/    # Accès aux données
│   ├── routes/         # Définition des routes
│   ├── middleware/     # Middlewares personnalisés
│   ├── validator/      # Validation des données
│   └── index.ts        # Point d'entrée
├── prisma/
│   ├── schema.prisma   # Schéma de la base de données
│   └── seed.js         # Script de peuplement
├── test_data_seed.js   # Données de test complètes
├── setup.sh           # Script de configuration automatique
└── DOCUMENTATION.md   # Documentation détaillée
```

## 🔒 Variables d'environnement

Créer un fichier `.env` à la racine :

```env
DATABASE_URL="mysql://user:password@localhost:3306/todo_db"
JWT_SECRET="votre_secret_jwt_super_securise"
```

## 🧪 Tests

### Données de test disponibles

Le script de configuration crée automatiquement :
- **5 utilisateurs** avec différents rôles
- **12 tâches** variées (complétées/non complétées)
- **3 partages** de tâches avec permissions

### Tests manuels

Utilisez les comptes de test pour tester les fonctionnalités :
1. Connexion avec un compte utilisateur
2. Création, modification, suppression de tâches
3. Test des permissions (ADMIN vs USER)
4. Test du partage de tâches

## 📖 Documentation complète

Consultez `DOCUMENTATION.md` pour :
- Architecture détaillée
- Exemples de requêtes
- Guide de déploiement
- Dépannage

## 🐛 Dépannage

### Le script ne s'exécute pas
```bash
# Vérifier les permissions
ls -la setup.sh

# Donner les permissions si nécessaire
chmod +x setup.sh
```

### Port 3000 déjà utilisé
Le script détecte automatiquement et libère le port.

### Erreur de base de données
Vérifiez votre fichier `.env` et que la base de données est accessible.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push et créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

---

*Généré par BLACKBOXAI - Script de configuration automatique inclus*

#Délégué une permissions

# Partager une tâche avec permission READ
#POST /tasks/:id/share
#{
#  "userId": 2,
#  "permission": "READ"
#}
#
## Partager une tâche avec permission WRITE
#POST /tasks/:id/share
#{
#  "userId": 2,
#  "permission": "WRITE"
#}
#
## Partager une tâche avec permission DELETE
#POST /tasks/:id/share
#{
#  "userId": 2,
#  "permission": "DELETE"
#}