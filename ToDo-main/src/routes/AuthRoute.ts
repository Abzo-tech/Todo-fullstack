import express from "express";
import { AuthController } from "../controllers/AuthController.js";

const router = express.Router();
const authController = new AuthController();

// Route de connexion
router.post("/login", authController.login);

// Route d'inscription (optionnel)
router.post("/register", authController.register);

// Route de rafraîchissement du token (optionnel)
// router.post("/refresh", authController.refreshToken);

export default router;
