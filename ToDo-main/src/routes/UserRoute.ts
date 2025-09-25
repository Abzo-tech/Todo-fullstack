import { Router } from "express";
import { UserController } from "../controllers/userController.js";

const router = Router();
const userController = new UserController();

router.get("/", userController.getAll);
router.get("/:id", userController.findById);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

export default router;
