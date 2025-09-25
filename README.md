# Todo-fullstack 📝

Une application de gestion de tâches full-stack moderne avec authentification, partage de tâches, upload de médias et notifications temps réel.

## 🚀 Fonctionnalités

- ✅ Authentification utilisateur (inscription/connexion)
- ✅ CRUD complet des tâches
- ✅ Partage de tâches entre utilisateurs
- ✅ Upload d'images et d'audio
- ✅ Notifications temps réel avec Socket.IO
- ✅ Interface responsive
- ✅ Archivage des tâches
- ✅ Rappels programmés
- ✅ Permissions (Lecture/Écriture/Suppression)

## 🏗️ Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Base de données**: MySQL avec Prisma ORM
- **Authentification**: JWT
- **Temps réel**: Socket.IO
- **Upload de fichiers**: Multer

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- MySQL
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le repository

```bash
git clone <url-du-repo>
cd Todo-fullstack
```

### 2. Configuration de la base de données

#### Option A: Utiliser MySQL local

Assurez-vous que MySQL est installé et configuré.

#### Option B: Utiliser Docker (recommandé)

```bash
# Installer Docker si ce n'est pas fait
# Puis créer un conteneur MySQL
docker run --name todo-mysql -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=Todo-list -p 3306:3306 -d mysql:8.0
```

### 3. Configuration des variables d'environnement

Créer un fichier `.env` dans le dossier `ToDo-main/` :

```env
DATABASE_URL="mysql://root:rootpassword@localhost:3306/Todo-list"
JWT_SECRET="votre-cle-secrete-très-longue-et-complexe"
PORT=3000
```

### 4. Installation des dépendances

#### Backend (ToDo-main)
```bash
cd ToDo-main
npm install
```

#### Frontend (todo-list)
```bash
cd ../todo-list
npm install
```

### 5. Initialisation de la base de données

```bash
cd ToDo-main
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# (Optionnel) Peupler avec des données de test
npm run seed
```

### 6. Démarrage des serveurs

#### Terminal 1: Backend
```bash
cd ToDo-main
npm run dev
```

#### Terminal 2: Frontend
```bash
cd todo-list
npm run dev
```

### 7. Accès à l'application

- **Frontend**: http://localhost:5175
- **Backend API**: http://localhost:3000
- **Documentation API**: http://localhost:3000/api-docs (si configuré)

## 👤 Comptes de test

Après l'exécution des seeds, vous pouvez utiliser ces comptes :

- **alice.dupont@example.com** / password123
- **jean.martin@example.com** / password123 (ADMIN)
- **marie.leroy@example.com** / password123
- **pierre.durand@example.com** / password123
- **sophie.moreau@example.com** / password123

## 📁 Structure du projet

```
Todo-fullstack/
├── todo-list/          # Frontend React
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .gitignore
├── ToDo-main/          # Backend Node.js
│   ├── src/
│   ├── prisma/
│   ├── assets/         # Fichiers uploadés
│   ├── package.json
│   └── .gitignore
├── .gitignore         # Gitignore principal
└── README.md          # Ce fichier
```

## 🔧 Scripts disponibles

### Backend (ToDo-main)

```bash
npm run dev          # Démarrage en développement
npm run build        # Build de production
npm run start        # Démarrage en production
npm run seed         # Peupler la base avec des données de test
npm run migrate      # Appliquer les migrations Prisma
```

### Frontend (todo-list)

```bash
npm run dev          # Démarrage en développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
```

## 🌐 API Endpoints principaux

### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription

### Tâches
- `GET /tasks` - Lister les tâches
- `POST /tasks` - Créer une tâche
- `PUT /tasks/:id` - Modifier une tâche
- `DELETE /tasks/:id` - Supprimer une tâche
- `PATCH /tasks/:id/toggle` - Basculer l'état complété

### Partage de tâches
- `POST /tasks/:id/share` - Partager une tâche
- `GET /tasks/:id/shares` - Voir les partages
- `DELETE /tasks/:id/share/:userId` - Retirer un partage

### Upload de médias
- `POST /tasks/:id/upload-image` - Uploader une image
- `POST /tasks/:id/upload-audio` - Uploader un audio

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez que tous les prérequis sont installés
2. Vérifiez les variables d'environnement
3. Consultez les logs du serveur
4. Ouvrez une issue sur GitHub

## 🔄 Migrations futures

- [ ] Tests unitaires et d'intégration
- [ ] CI/CD avec GitHub Actions
- [ ] Déploiement Docker
- [ ] Interface d'administration
- [ ] Notifications push
- [ ] Synchronisation mobile