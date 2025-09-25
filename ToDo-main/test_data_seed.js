import { PrismaClient, Role, Permission } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Début du seed des données de test...");

  // Supprimer toutes les données existantes dans l'ordre inverse des dépendances
  await prisma.taskShare.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  console.log("Création des utilisateurs de test...");

  // Création des utilisateurs de test avec mots de passe hashés
  const usersData = [
    {
      name: "Alice Dupont",
      email: "alice.dupont@example.com",
      password: await bcrypt.hash("password123", 10),
      role: Role.USER,
    },
    {
      name: "Bob Martin",
      email: "bob.martin@example.com",
      password: await bcrypt.hash("password123", 10),
      role: Role.USER,
    },
    {
      name: "Charlie Durand",
      email: "charlie.durand@example.com",
      password: await bcrypt.hash("password123", 10),
      role: Role.USER,
    },
    {
      name: "Diana Prince",
      email: "diana.prince@example.com",
      password: await bcrypt.hash("password123", 10),
      role: Role.USER,
    },
    {
      name: "Admin System",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: Role.ADMIN,
    },
  ];

  const users = [];
  for (const userData of usersData) {
    const user = await prisma.user.create({ data: userData });
    users.push(user);
  }

  console.log("Création des tâches de test...");

  // Fonction helper pour créer des dates
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Création des tâches pour chaque utilisateur
  const tasksData = [
    // Tâches d'Alice
    {
      title: "Acheter du pain",
      description: "Aller à la boulangerie du coin pour acheter une baguette fraîche",
      completed: false,
      startDate: tomorrow,
      endDate: tomorrow,
      reminderEnabled: true,
      userId: users[0].id,
    },
    {
      title: "Réviser TypeScript",
      description: "Étudier les types avancés et les génériques en TypeScript",
      completed: true,
      startDate: yesterday,
      endDate: now,
      reminderEnabled: false,
      userId: users[0].id,
    },
    {
      title: "Appeler maman",
      description: "Téléphoner à maman pour prendre des nouvelles",
      completed: false,
      startDate: now,
      endDate: tomorrow,
      reminderEnabled: true,
      userId: users[0].id,
    },
    {
      title: "Préparer dîner d'anniversaire",
      description: "Acheter les ingrédients et préparer le gâteau pour l'anniversaire de papa",
      completed: false,
      startDate: nextWeek,
      endDate: nextWeek,
      reminderEnabled: true,
      userId: users[0].id,
    },

    // Tâches de Bob
    {
      title: "Faire les courses",
      description: "Liste de courses : lait, œufs, fromage, légumes, pain complet",
      completed: false,
      startDate: tomorrow,
      endDate: tomorrow,
      reminderEnabled: false,
      userId: users[1].id,
    },
    {
      title: "Nettoyer la voiture",
      description: "Laver l'extérieur et aspirer l'intérieur de la voiture",
      completed: true,
      startDate: yesterday,
      endDate: yesterday,
      reminderEnabled: false,
      userId: users[1].id,
    },
    {
      title: "Préparer présentation projet",
      description: "Préparer les slides pour la réunion client demain matin",
      completed: false,
      startDate: tomorrow,
      endDate: tomorrow,
      reminderEnabled: true,
      userId: users[1].id,
    },
    {
      title: "Formation React avancé",
      description: "Suivre le cours en ligne sur les hooks avancés et la performance",
      completed: false,
      startDate: nextWeek,
      endDate: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
      reminderEnabled: true,
      userId: users[1].id,
    },

    // Tâches de Charlie
    {
      title: "Sport - Course à pied",
      description: "Faire 5km de course dans le parc, objectif : améliorer le chrono",
      completed: false,
      startDate: tomorrow,
      endDate: tomorrow,
      reminderEnabled: true,
      userId: users[2].id,
    },
    {
      title: "Lire un livre",
      description: "Commencer le nouveau roman de science-fiction 'Dune' de Frank Herbert",
      completed: true,
      startDate: yesterday,
      endDate: now,
      reminderEnabled: false,
      userId: users[2].id,
    },
    {
      title: "Concert de jazz",
      description: "Assister au concert du groupe local au théâtre municipal",
      completed: false,
      startDate: nextWeek,
      endDate: nextWeek,
      reminderEnabled: true,
      userId: users[2].id,
    },

    // Tâches de Diana
    {
      title: "Rendez-vous dentiste",
      description: "RDV chez le dentiste à 14h30 pour le contrôle annuel",
      completed: false,
      startDate: nextWeek,
      endDate: nextWeek,
      reminderEnabled: true,
      userId: users[3].id,
    },
    {
      title: "Planifier vacances d'été",
      description: "Rechercher des destinations en Europe et comparer les prix des vols et hôtels",
      completed: false,
      startDate: now,
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      reminderEnabled: false,
      userId: users[3].id,
    },
    {
      title: "Cours de yoga",
      description: "S'inscrire au cours de yoga hebdomadaire du samedi matin",
      completed: true,
      startDate: yesterday,
      endDate: yesterday,
      reminderEnabled: false,
      userId: users[3].id,
    },

    // Tâches de l'Admin
    {
      title: "Maintenance serveur",
      description: "Vérifier les logs, mettre à jour les dépendances et optimiser les performances",
      completed: false,
      startDate: tomorrow,
      endDate: tomorrow,
      reminderEnabled: true,
      userId: users[4].id,
    },
    {
      title: "Réunion équipe développement",
      description: "Point hebdomadaire avec l'équipe de développement pour faire le bilan",
      completed: true,
      startDate: yesterday,
      endDate: yesterday,
      reminderEnabled: false,
      userId: users[4].id,
    },
    {
      title: "Audit sécurité",
      description: "Réviser les politiques de sécurité et mettre à jour les certificats SSL",
      completed: false,
      startDate: nextWeek,
      endDate: new Date(nextWeek.getTime() + 7 * 24 * 60 * 60 * 1000),
      reminderEnabled: true,
      userId: users[4].id,
    },
  ];

  const tasks = [];
  for (const taskData of tasksData) {
    const task = await prisma.task.create({ data: taskData });
    tasks.push(task);
  }

  console.log("Création des partages de tâches...");

  // Création des partages de tâches pour tester la fonctionnalité
  const sharesData = [
    // Alice partage sa tâche "Réviser TypeScript" avec Bob (READ + WRITE)
    {
      taskId: tasks[1].id, // Tâche d'Alice
      userId: users[1].id, // Bob
      permissions: ['READ', 'WRITE'],
    },
    // Alice partage sa tâche "Appeler maman" avec Charlie (WRITE + DELETE)
    {
      taskId: tasks[2].id, // Tâche d'Alice
      userId: users[2].id, // Charlie
      permissions: ['WRITE', 'DELETE'],
    },
    // Bob partage sa tâche "Préparer présentation" avec Diana (READ only)
    {
      taskId: tasks[5].id, // Tâche de Bob
      userId: users[3].id, // Diana
      permissions: ['READ'],
    },
    // Charlie partage sa tâche "Sport - Course à pied" avec Alice (READ + WRITE + DELETE)
    {
      taskId: tasks[6].id, // Tâche de Charlie
      userId: users[0].id, // Alice
      permissions: ['READ', 'WRITE', 'DELETE'],
    },
  ];

  for (const shareData of sharesData) {
    await prisma.taskShare.create({
      data: {
        taskId: shareData.taskId,
        userId: shareData.userId,
        permissions: shareData.permissions,
      }
    });
  }

  console.log("Données de test créées avec succès !");
  // Créer quelques tâches archivées pour démontrer la fonctionnalité
  console.log("Création de tâches archivées...");
  const archivedTasksData = [
    {
      title: "Projet terminé - Site web portfolio",
      description: "Site web personnel terminé et déployé avec succès",
      completed: true,
      archived: true,
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      reminderEnabled: false,
      userId: users[0].id,
    },
    {
      title: "Formation complétée - Node.js",
      description: "Cours Udemy sur Node.js terminé avec certification",
      completed: true,
      archived: true,
      startDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      reminderEnabled: false,
      userId: users[1].id,
    },
  ];

  for (const taskData of archivedTasksData) {
    await prisma.task.create({ data: taskData });
  }

  console.log("Données de test créées avec succès !");
  console.log("\n=== INFORMATIONS DE CONNEXION ===");
  console.log("Utilisateurs créés :");
  users.forEach((user, index) => {
    const password = user.email === "admin@example.com" ? "admin123" : "password123";
    console.log(`${index + 1}. ${user.name} - ${user.email} - Mot de passe: ${password} - Rôle: ${user.role}`);
  });

  console.log("\nTâches créées :");
  tasks.forEach((task, index) => {
    const owner = users.find(u => u.id === task.userId);
    const reminder = task.reminderEnabled ? " (avec rappel)" : "";
    console.log(`${index + 1}. "${task.title}" - Propriétaire: ${owner?.name} - Complétée: ${task.completed}${reminder}`);
  });

  console.log("\nTâches archivées créées :");
  archivedTasksData.forEach((task, index) => {
    const owner = users.find(u => u.id === task.userId);
    console.log(`${index + 1}. "${task.title}" - Propriétaire: ${owner?.name} - Archivée: ${task.archived}`);
  });

  console.log("\nPartages créés :");
  sharesData.forEach((share, index) => {
    const task = tasks.find(t => t.id === share.taskId);
    const sharedWith = users.find(u => u.id === share.userId);
    console.log(`${index + 1}. Tâche "${task?.title}" partagée avec ${sharedWith?.name} (${share.permission})`);
  });

  console.log("\n=== EXEMPLES D'UTILISATION ===");
  console.log("1. Connexion : POST /auth/login avec alice.dupont@example.com / password123");
  console.log("2. Récupérer tâches : GET /tasks (avec token JWT)");
  console.log("3. Créer tâche : POST /tasks avec {title, description, startDate, endDate, reminderEnabled}");
  console.log("4. Basculer tâche : PATCH /tasks/:id/toggle");
  console.log("5. Archiver tâche : PATCH /tasks/:id/archive");
  console.log("6. Uploader image : POST /tasks/:id/upload-image (multipart/form-data)");
  console.log("7. Partager tâche : POST /tasks/:id/share avec {userId, permission}");
  console.log("8. Récupérer tâches archivées : GET /tasks/archived/all");
  console.log("\n=== FONCTIONNALITÉS DISPONIBLES ===");
  console.log("✅ Authentification JWT");
  console.log("✅ CRUD complet des tâches");
  console.log("✅ Partage de tâches avec permissions");
  console.log("✅ Upload d'images et d'audio");
  console.log("✅ Notifications temps réel (Socket.IO)");
  console.log("✅ Archivage des tâches");
  console.log("✅ Rappels programmés");
  console.log("✅ Interface responsive");
}

main()
  .catch((e) => {
    console.error("Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
