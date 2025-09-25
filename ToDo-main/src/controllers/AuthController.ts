import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";

const authService = new AuthService();

export class AuthController {
  register = async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        return res.status(400).json({ error: "Corps de la requête manquant" });
      }
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Nom, email et mot de passe requis" });
      }
      const result = await authService.register(name, email, password);
      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        return res.status(400).json({ error: "Corps de la requête manquant" });
      }
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe requis" });
      }
      const result = await authService.login(email, password);
      return res.json(result);
    } catch (err) {
      return res.status(401).json({ error: (err as Error).message });
    }
  };
}
