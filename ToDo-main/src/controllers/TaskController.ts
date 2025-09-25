import { Request, Response } from "express";
import { Task, Permission } from "@prisma/client";
import { TaskService } from "../services/TaskService.js";
import { CreateTaskSchema } from "../validator/TaskValidator.js";
import { emitNotification } from "../index.js";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}

export class TaskController {
  private taskService: TaskService = new TaskService();

  getAll = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }
      const adtasks = await this.taskService.getAllTasks(userId);
      return res.json(adtasks);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id: number = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      // Vérifier les permissions d'accès
      const access = await this.taskService.canUserAccessTask(id, userId);
      if (!access.canAccess) {
        return res
          .status(403)
          .json({ error: "Accès non autorisé à cette tâche" });
      }

      const adtask = await this.taskService.findTaskById(id);
      if (!adtask) {
        return res.status(404).json({ error: "Tâche non trouvée" });
      }
      return res.json(adtask);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }
      const data = CreateTaskSchema.parse(req.body);
      // Convertir les dates en objets Date pour Prisma
      const taskData = {
        ...data,
        userId,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null
      } as Omit<Task, "id">;
      const adtask = await this.taskService.createTask(taskData);

      // Émettre une notification temps réel
      emitNotification(userId, 'taskCreated', {
        message: `Nouvelle tâche créée: "${adtask.title}"`,
        type: 'success',
        task: adtask
      });

      return res.status(201).json(adtask);
    } catch (error: any) {
      const errors = error.errors ?? [{ message: error.message }];
      return res.status(400).json({ errors });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id: number = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      // Vérifier les permissions de modification
      const canModify = await this.taskService.canUserModifyTask(id, userId);
      if (!canModify) {
        return res
          .status(403)
          .json({
            error: "Permissions insuffisantes pour modifier cette tâche",
          });
      }

      const data = CreateTaskSchema.parse(req.body);
      // Convertir les dates en objets Date pour Prisma
      const updateData = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined
      };
      const adtask = await this.taskService.updateTask(id, updateData);
      res.json(adtask);
      return;
    } catch (error: any) {
      const errors = error.errors ?? [{ message: error.message }];
      return res.status(400).json({ errors });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: number = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      // Vérifier les permissions de suppression
      const canDelete = await this.taskService.canUserDeleteTask(id, userId);
      if (!canDelete) {
        return res
          .status(403)
          .json({
            error: "Permissions insuffisantes pour supprimer cette tâche",
          });
      }

      await this.taskService.deleteTask(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  toggleTodo = async (req: Request, res: Response) => {
    try {
      const id: number = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      // Vérifier les permissions d'accès (le toggle nécessite au minimum READ)
      const access = await this.taskService.canUserAccessTask(id, userId);
      if (!access.canAccess) {
        return res
          .status(403)
          .json({ error: "Accès non autorisé à cette tâche" });
      }

      const adtask = await this.taskService.toggleTodo(id);
      if (!adtask) {
        return res.status(404).json({ error: "Tâche non trouvée" });
      }

      // Émettre une notification temps réel
      emitNotification(userId, 'taskUpdated', {
        message: `Tâche "${adtask.title}" ${adtask.completed ? 'terminée' : 'marquée comme active'}`,
        type: 'info',
        task: adtask
      });

      return res.json(adtask);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  // Méthodes pour le partage de tâches
  shareTask = async (req: Request, res: Response) => {
    try {
      const taskId = Number(req.params.id);
      const { userId: sharedWithId, permissions } = req.body;
      const ownerId = req.user?.id;

      if (!ownerId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      if (!sharedWithId || !permissions || !Array.isArray(permissions) || permissions.length === 0) {
        return res
          .status(400)
          .json({ error: "userId et permissions (tableau) sont requis" });
      }

      // Valider les permissions
      const validPermissions = ['READ', 'WRITE', 'DELETE'];
      for (const perm of permissions) {
        if (!validPermissions.includes(perm)) {
          return res
            .status(400)
            .json({
              error: `Permission invalide: ${perm}. Utilisez READ, WRITE ou DELETE`,
            });
        }
      }

      const share = await this.taskService.shareTask(
        taskId,
        ownerId,
        sharedWithId,
        permissions
      );

      // Émettre une notification temps réel au destinataire
      emitNotification(sharedWithId, 'taskShared', {
        message: `Une tâche vous a été partagée avec les permissions: ${permissions.join(', ')}`,
        type: 'success',
        share: share
      });

      return res.status(201).json(share);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  getTaskShares = async (req: Request, res: Response) => {
    try {
      const taskId = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      const shares = await this.taskService.getTaskShares(taskId, userId);
      return res.json(shares);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  getUserSharedTasks = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      const tasks = await this.taskService.getUserSharedTasks(userId);
      return res.json(tasks);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateTaskShare = async (req: Request, res: Response) => {
    try {
      const taskId = Number(req.params.id);
      const sharedWithId = Number(req.params.userId);
      const { permissions } = req.body;
      const ownerId = req.user?.id;

      if (!ownerId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
        return res.status(400).json({ error: "Permissions (tableau) sont requises" });
      }

      // Valider les permissions
      const validPermissions = ['READ', 'WRITE', 'DELETE'];
      for (const perm of permissions) {
        if (!validPermissions.includes(perm)) {
          return res
            .status(400)
            .json({
              error: `Permission invalide: ${perm}. Utilisez READ, WRITE ou DELETE`,
            });
        }
      }

      const share = await this.taskService.updateTaskShare(
        taskId,
        ownerId,
        sharedWithId,
        permissions
      );
      return res.json(share);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  removeTaskShare = async (req: Request, res: Response) => {
    try {
      const taskId = Number(req.params.id);
      const sharedWithId = Number(req.params.userId);
      const ownerId = req.user?.id;

      if (!ownerId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      const success = await this.taskService.removeTaskShare(
        taskId,
        ownerId,
        sharedWithId
      );
      if (success) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ error: "Partage non trouvé" });
      }
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  async uploadImage(req: Request, res: Response) {
    try {
      const id: number = Number(req.params.id);
      const userId = req.user?.id;
      const file = (req as any).file as any;

      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      if (!file) {
        return res.status(400).json({ error: "Aucune image envoyée" });
      }

      // Vérifier les permissions de modification
      const canModify = await this.taskService.canUserModifyTask(id, userId);
      if (!canModify) {
        return res
          .status(403)
          .json({
            error: "Permissions insuffisantes pour modifier cette tâche",
          });
      }

      const imageUrl = `/assets/${file.filename}`;
      const task = await this.taskService.uploadImage(id, imageUrl);

      return res.json({ message: "Image uploadée", imageUrl, task });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async uploadAudio(req: Request, res: Response) {
    try {
      const id: number = Number(req.params.id);
      const userId = req.user?.id;
      const file = (req as any).file as any;

      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      if (!file) {
        return res.status(400).json({ error: "Aucun fichier audio envoyé" });
      }

      // Vérifier les permissions de modification
      const canModify = await this.taskService.canUserModifyTask(id, userId);
      if (!canModify) {
        return res
          .status(403)
          .json({
            error: "Permissions insuffisantes pour modifier cette tâche",
          });
      }

      const audioUrl = `/assets/${file.filename}`;
      const task = await this.taskService.uploadAudio(id, audioUrl);

      return res.json({ message: "Audio uploadé", audioUrl, task });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Méthodes pour l'archivage des tâches
  archive = async (req: Request, res: Response) => {
    try {
      const id: number = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      const task = await this.taskService.archiveTask(id, userId);
      if (!task) {
        return res.status(404).json({ error: "Tâche non trouvée" });
      }

      return res.json({ message: "Tâche archivée avec succès", task });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  unarchive = async (req: Request, res: Response) => {
    try {
      const id: number = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      const task = await this.taskService.unarchiveTask(id, userId);
      if (!task) {
        return res.status(404).json({ error: "Tâche non trouvée" });
      }

      return res.json({ message: "Tâche désarchivée avec succès", task });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  getArchived = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      const archivedTasks = await this.taskService.getArchivedTasks(userId);
      return res.json(archivedTasks);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  findUserByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({ error: "Email requis" });
      }

      const user = await this.taskService.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      // Ne pas retourner le mot de passe
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  getAllCategorized = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      console.log('getAllCategorized called, userId:', userId, 'type:', typeof userId);

      // Validation plus stricte de l'userId
      if (!userId || typeof userId !== 'number' || userId <= 0 || !Number.isInteger(userId)) {
        console.log('Invalid userId:', userId, 'type:', typeof userId);
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      console.log('Calling taskService.getAllTasksCategorized with userId:', userId);
      const categorizedTasks = await this.taskService.getAllTasksCategorized(userId);
      console.log('categorizedTasks result:', categorizedTasks);
      return res.json(categorizedTasks);
    } catch (error: any) {
      console.log('Error in getAllCategorized:', error.message);
      console.log('Error stack:', error.stack);
      return res.status(500).json({ error: error.message });
    }
  };

  getAllTasks = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      const allTasks = await this.taskService.getAllTasks(userId);
      return res.json(allTasks);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  getAllTasksFromAllUsers = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      const allTasks = await this.taskService.getAllTasksFromAllUsers();
      return res.json(allTasks);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}
