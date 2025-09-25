import { Task, Permission } from "@prisma/client";
import { TodoRepository } from "../repositories/TodoRepository.js";

export class TaskService {
  private repo: TodoRepository;

  constructor() {
    this.repo = new TodoRepository();
  }

  async getAllTasks(userId: number): Promise<Task[]> {
    // Récupérer les tâches de l'utilisateur (owned + shared)
    const ownedTasks = await this.repo.findByUserId(userId);
    const sharedTasks = await this.repo.getUserSharedTasks(userId);

    // Fusionner les tâches sans doublons
    const taskMap = new Map<number, Task>();
    ownedTasks.forEach((task) => taskMap.set(task.id, task));
    sharedTasks.forEach((task) => taskMap.set(task.id, task));

    return Array.from(taskMap.values());
  }

  async getAllTasksFromAllUsers(): Promise<Task[]> {
    // Récupérer TOUTES les tâches de TOUS les utilisateurs
    return this.repo.findAll();
  }

  findTaskById(id: number): Promise<Task | null> {
    return this.repo.findById(id);
  }

  createTask(data: Omit<Task, "id">): Promise<Task> {
    if (!data.userId) throw new Error("userId est requis pour créer une tâche");
    return this.repo.create(data);
  }

  updateTask(id: number, data: Partial<Omit<Task, "id">>): Promise<Task> {
    return this.repo.update(id, data);
  }

  async deleteTask(id: number): Promise<boolean> {
    const adtask = await this.repo.delete(id);
    return !!adtask;
  }

  async toggleTodo(id: number): Promise<Task | null> {
    return this.repo.toggleTodo(id);
  }

  // Méthodes pour le partage de tâches
  async shareTask(
    taskId: number,
    ownerId: number,
    sharedWithId: number,
    permission: Permission
  ) {
    // Vérifier que l'utilisateur est le propriétaire de la tâche
    const task = await this.findTaskById(taskId);
    if (!task) {
      throw new Error("Tâche non trouvée");
    }

    if (task.userId !== ownerId) {
      throw new Error("Seul le propriétaire peut partager la tâche");
    }

    // Vérifier que l'utilisateur ne se partage pas sa propre tâche
    if (ownerId === sharedWithId) {
      throw new Error("Vous ne pouvez pas partager une tâche avec vous-même");
    }

    return this.repo.shareTask(taskId, sharedWithId, permission);
  }

  async getTaskShares(taskId: number, userId: number) {
    // Vérifier que l'utilisateur a accès à la tâche
    const access = await this.repo.canUserAccessTask(taskId, userId);
    if (!access.canAccess) {
      throw new Error("Accès non autorisé à cette tâche");
    }

    return this.repo.getTaskShares(taskId);
  }

  async getUserSharedTasks(userId: number) {
    return this.repo.getUserSharedTasks(userId);
  }

  async updateTaskShare(
    taskId: number,
    ownerId: number,
    sharedWithId: number,
    permission: Permission
  ) {
    const task = await this.findTaskById(taskId);
    if (!task || task.userId !== ownerId) {
      throw new Error("Seul le propriétaire peut modifier les permissions");
    }

    return this.repo.updateTaskShare(taskId, sharedWithId, permission);
  }

  async removeTaskShare(taskId: number, ownerId: number, sharedWithId: number) {
    const task = await this.findTaskById(taskId);
    if (!task || task.userId !== ownerId) {
      throw new Error("Seul le propriétaire peut retirer le partage");
    }

    return this.repo.removeTaskShare(taskId, sharedWithId);
  }

  async canUserAccessTask(taskId: number, userId: number) {
    return this.repo.canUserAccessTask(taskId, userId);
  }

  async canUserModifyTask(taskId: number, userId: number) {
    return this.repo.canUserModifyTask(taskId, userId);
  }

  async canUserDeleteTask(taskId: number, userId: number) {
    return this.repo.canUserDeleteTask(taskId, userId);
  }

  async uploadImage(id: number, imageUrl: string) {
    return this.repo.update(id, { imageUrl });
  }

  async uploadAudio(id: number, audioUrl: string) {
    return this.repo.update(id, { audioUrl });
  }

  // Méthode pour trouver un utilisateur par email
  async findUserByEmail(email: string) {
    return this.repo.findUserByEmail(email);
  }

  // Méthodes pour l'archivage des tâches
  async archiveTask(id: number, userId: number): Promise<Task | null> {
    // Vérifier que l'utilisateur a accès à la tâche
    const access = await this.canUserAccessTask(id, userId);
    if (!access.canAccess) {
      throw new Error("Accès non autorisé à cette tâche");
    }

    return this.repo.update(id, { archived: true });
  }

  async unarchiveTask(id: number, userId: number): Promise<Task | null> {
    // Vérifier que l'utilisateur a accès à la tâche
    const access = await this.canUserAccessTask(id, userId);
    if (!access.canAccess) {
      throw new Error("Accès non autorisé à cette tâche");
    }

    return this.repo.update(id, { archived: false });
  }

  async getArchivedTasks(userId: number): Promise<Task[]> {
    return this.repo.findArchivedByUserId(userId);
  }

  async getAllTasksWithArchived(userId: number): Promise<{
    active: Task[];
    archived: Task[];
  }> {
    const ownedTasks = await this.repo.findByUserId(userId);
    const sharedTasks = await this.repo.getUserSharedTasks(userId);

    // Fusionner les tâches sans doublons
    const taskMap = new Map<number, Task>();
    ownedTasks.forEach((task) => taskMap.set(task.id, task));
    sharedTasks.forEach((task) => taskMap.set(task.id, task));

    const allTasks = Array.from(taskMap.values());

    return {
      active: allTasks.filter((task) => !task.archived),
      archived: allTasks.filter((task) => task.archived),
    };
  }

  async getAllTasksCategorized(userId: number): Promise<{
    owned: Task[];
    shared: Task[];
    ownedActive: Task[];
    ownedArchived: Task[];
    sharedActive: Task[];
    sharedArchived: Task[];
  }> {
    console.log('getAllTasksCategorized called with userId:', userId);

    // Validation de l'userId
    if (!userId || typeof userId !== 'number' || userId <= 0 || !Number.isInteger(userId)) {
      console.log('getAllTasksCategorized: invalid userId:', userId);
      throw new Error('ID utilisateur invalide');
    }

    try {
      const ownedTasks = await this.repo.findByUserId(userId);
      console.log('ownedTasks found:', ownedTasks.length);
      const sharedTasks = await this.repo.getUserSharedTasks(userId);
      console.log('sharedTasks found:', sharedTasks.length);

      const result = {
        owned: ownedTasks,
        shared: sharedTasks,
        ownedActive: ownedTasks.filter((task) => !task.archived),
        ownedArchived: ownedTasks.filter((task) => task.archived),
        sharedActive: sharedTasks.filter((task) => !task.archived),
        sharedArchived: sharedTasks.filter((task) => task.archived),
      };

      console.log('getAllTasksCategorized result:', {
        owned: result.owned.length,
        shared: result.shared.length,
        ownedActive: result.ownedActive.length,
        ownedArchived: result.ownedArchived.length,
        sharedActive: result.sharedActive.length,
        sharedArchived: result.sharedArchived.length,
      });

      return result;
    } catch (error) {
      console.log('getAllTasksCategorized error:', error);
      throw error;
    }
  }
}
