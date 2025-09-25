import { PrismaClient, User } from "@prisma/client";
import { IRepository } from "./Irepository.js";

export class UserRepository implements IRepository<User> {
  private prisma = new PrismaClient();

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: Omit<User, "id">): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.user.delete({ where: { id } });
    return true;
  }
}
