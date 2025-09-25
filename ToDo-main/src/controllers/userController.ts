import { Request, Response } from "express";
import { UserService } from "../services/userService.js";

export class UserController {
  private userService = new UserService();

  getAll = async (_req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const user = await this.userService.findUserById(id);
      if (!user)
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
        return error;
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const user = await this.userService.updateUser(id, req.body);
      return res.json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.userService.deleteUser(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
}
