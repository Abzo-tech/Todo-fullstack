import { PrismaClient, type Task, type TaskShare, Permission} from "@prisma/client";
import type { IRepository } from "./Irepository.js";


export class TodoRepository implements IRepository<Task> {
  private prisma: PrismaClient = new PrismaClient();

  async findAll(): Promise<Task[]> {
    // ici le return doit être direct
    return this.prisma.task.findMany({
      include: {
        user: true, // récupère le user lié à chaque tâche
        sharedWith: {
          include: {
            sharedWith: true
          }
        }
      },
    });
  }

  async findById(id: number): Promise<Task | null> {
    if (!id || id <= 0) {
      return null;
    }
    return this.prisma.task.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: number): Promise<Task[]> {
    // More lenient validation - just check if userId is a positive number
    console.log('findByUserId called with userId:', userId, 'type:', typeof userId);
    if (typeof userId !== 'number' || userId <= 0 || !Number.isInteger(userId)) {
      console.log('findByUserId validation failed for userId:', userId);
      return [];
    }
    console.log('findByUserId executing query for userId:', userId);
    try {
      const result = await this.prisma.task.findMany({
        where: { userId },
        include: {
          user: true,
          sharedWith: {
            include: {
              sharedWith: true
            }
          }
        },
      });
      console.log('findByUserId result:', result.length, 'tasks');
      return result;
    } catch (error) {
      console.log('findByUserId error:', error);
      throw error;
    }
  }

  async create(
    data: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  async update(id: number, data: Partial<Omit<Task, "id">>): Promise<Task> {
    if (!id || id <= 0) {
      throw new Error("Invalid task ID");
    }
    return this.prisma.task.update({ where: { id }, data });
  }

  async delete(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error("Invalid task ID");
    }
    const deleteTodo = await this.prisma.task.delete({ where: { id } });
    return deleteTodo !== null;
  }

  async toggleTodo(id: number): Promise<Task | null> {
    if (!id || id <= 0) {
      throw new Error("Invalid task ID");
    }
    const adtask = await this.findById(id);
    if (!adtask) {
      throw new Error("Task not found");
    }
    const updatedTodo = await this.prisma.task.update({
      where: { id },
      data: { completed: !adtask.completed },
    });
    return updatedTodo;
  }

  // Méthodes pour le partage de tâches
  async shareTask(taskId: number, sharedWithId: number, permission: Permission): Promise<TaskShare> {
    if (!taskId || taskId <= 0 || !sharedWithId || sharedWithId <= 0) {
      throw new Error("Invalid task ID or user ID");
    }
    return this.prisma.taskShare.create({
      data: {
        taskId,
        userId: sharedWithId,
        permission,
      },
      include: {
        task: true,
        sharedWith: true,
      },
    });
  }

  async getTaskShares(taskId: number): Promise<TaskShare[]> {
    if (!taskId || taskId <= 0) {
      return [];
    }
    return this.prisma.taskShare.findMany({
      where: { taskId },
      include: {
        sharedWith: true,
      },
    });
  }

  async getUserSharedTasks(userId: number): Promise<Task[]> {
    // More lenient validation - just check if userId is a positive number
    console.log('getUserSharedTasks called with userId:', userId, 'type:', typeof userId);
    if (typeof userId !== 'number' || userId <= 0 || !Number.isInteger(userId)) {
      console.log('getUserSharedTasks validation failed for userId:', userId);
      return [];
    }
    console.log('getUserSharedTasks executing query for userId:', userId);
    try {
      const shares = await this.prisma.taskShare.findMany({
        where: { userId },
        include: {
          task: {
            include: {
              user: true,
              sharedWith: {
                include: {
                  sharedWith: true
                }
              }
            },
          },
        },
      });
      console.log('getUserSharedTasks found:', shares.length, 'shares');
      const result = shares.map(share => share.task);
      console.log('getUserSharedTasks returning:', result.length, 'tasks');
      return result;
    } catch (error) {
      console.log('getUserSharedTasks error:', error);
      throw error;
    }
  }

  async getUserTaskPermission(taskId: number, userId: number): Promise<TaskShare | null> {
    if (!taskId || taskId <= 0 || !userId || userId <= 0) {
      return null;
    }
    return this.prisma.taskShare.findUnique({
      where: {
        taskId_userId: {
          taskId,
          userId,
        },
      },
    });
  }

  async updateTaskShare(taskId: number, userId: number, permission: Permission): Promise<TaskShare> {
    if (!taskId || taskId <= 0 || !userId || userId <= 0) {
      throw new Error("Invalid task ID or user ID");
    }
    return this.prisma.taskShare.update({
      where: {
        taskId_userId: {
          taskId,
          userId,
        },
      },
      data: { permission },
      include: {
        task: true,
        sharedWith: true,
      },
    });
  }

  async removeTaskShare(taskId: number, userId: number): Promise<boolean> {
    if (!taskId || taskId <= 0 || !userId || userId <= 0) {
      throw new Error("Invalid task ID or user ID");
    }
    const result = await this.prisma.taskShare.delete({
      where: {
        taskId_userId: {
          taskId,
          userId,
        },
      },
    });
    return !!result;
  }

  async canUserAccessTask(taskId: number, userId: number): Promise<{ canAccess: boolean; permission?: Permission; isOwner?: boolean }> {
    console.log('canUserAccessTask called with taskId:', taskId, 'userId:', userId);

    // Validation plus stricte des paramètres
    if (!taskId || typeof taskId !== 'number' || taskId <= 0 || !Number.isInteger(taskId)) {
      console.log('canUserAccessTask: invalid taskId:', taskId, 'type:', typeof taskId);
      return { canAccess: false };
    }

    if (!userId || typeof userId !== 'number' || userId <= 0 || !Number.isInteger(userId)) {
      console.log('canUserAccessTask: invalid userId:', userId, 'type:', typeof userId);
      return { canAccess: false };
    }

    try {
      // Vérifier si l'utilisateur est le propriétaire
      console.log('canUserAccessTask: calling findById for taskId:', taskId);
      const task = await this.findById(taskId);
      console.log('canUserAccessTask: findById result:', task);
      if (!task) {
        console.log('canUserAccessTask: task not found');
        return { canAccess: false };
      }

      if (task.userId === userId) {
        console.log('canUserAccessTask: user is owner');
        return { canAccess: true, isOwner: true };
      }

      // Vérifier si la tâche est partagée avec l'utilisateur
      console.log('canUserAccessTask: checking task share');
      const share = await this.getUserTaskPermission(taskId, userId);
      console.log('canUserAccessTask: share result:', share);
      if (share) {
        console.log('canUserAccessTask: user has access via share');
        return { canAccess: true, permission: share.permission };
      }

      console.log('canUserAccessTask: no access');
      return { canAccess: false };
    } catch (error) {
      console.log('canUserAccessTask: error occurred:', error);
      return { canAccess: false };
    }
  }

  async canUserModifyTask(taskId: number, userId: number): Promise<boolean> {
    const access = await this.canUserAccessTask(taskId, userId);
    if (!access.canAccess) return false;
    if (access.isOwner) return true;

    // L'utilisateur peut modifier si la permission est WRITE ou DELETE
    return access.permission === Permission.WRITE || access.permission === Permission.DELETE;
  }

  async canUserDeleteTask(taskId: number, userId: number): Promise<boolean> {
    const access = await this.canUserAccessTask(taskId, userId);
    if (!access.canAccess) return false;
    if (access.isOwner) return true;

    // L'utilisateur peut supprimer seulement si la permission est DELETE
    return access.permission === Permission.DELETE;
  }

  // Méthode pour trouver un utilisateur par email
  async findUserByEmail(email: string) {
    if (!email || email.trim() === '') {
      return null;
    }
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Méthodes pour l'archivage des tâches
  async findArchivedByUserId(userId: number): Promise<Task[]> {
    if (!userId || userId <= 0) {
      return [];
    }
    return this.prisma.task.findMany({
      where: {
        userId,
        archived: true,
      },
      include: { user: true },
    });
  }
}
