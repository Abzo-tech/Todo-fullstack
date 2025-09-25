import { User, Role } from "@prisma/client";
import { UserRepository } from "../repositories/userRepository.js";

export class UserService {
  private repo: UserRepository;

  constructor() {
    this.repo = new UserRepository();
  }

  getAllUsers(): Promise<User[]> {
    return this.repo.findAll();
  }

  findUserById(id: number): Promise<User | null> {
    return this.repo.findById(id);
  }

  createUser(data: Omit<User, "id">): Promise<User> {
    // ✅ vérifie si le rôle est bien dans l’enum
    if (!Object.values(Role).includes(data.role)) {
      throw new Error(`Rôle invalide: ${data.role}`);
    }
    return this.repo.create(data);
  }

  updateUser(id: number, data: Partial<Omit<User, "id">>): Promise<User> {
    if (data.role && !Object.values(Role).includes(data.role)) {
      throw new Error(`Rôle invalide: ${data.role}`);
    }
    return this.repo.update(id, data);
  }

  async deleteUser(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
