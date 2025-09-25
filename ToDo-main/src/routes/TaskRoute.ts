import { Router, Request, Response } from "express";
import { TaskController } from "../controllers/TaskController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";


const router = Router();
const taskController = new TaskController();

// Appliquer le middleware d'authentification à toutes les routes de tâches
router.use(authenticateJWT);

router.get("/", taskController.getAllTasks);
router.get("/all-users", taskController.getAllTasksFromAllUsers);

// Routes spécifiques avant les routes génériques avec :id
router.get("/categorized", taskController.getAllCategorized);
router.get("/shared-with-me", taskController.getUserSharedTasks);
router.get("/archived/all", taskController.getArchived);
router.get("/user-by-email/:email", taskController.findUserByEmail);

// Routes génériques avec :id
router.get("/:id", taskController.findById);
router.post("/", taskController.create);
router.put("/:id", taskController.update);
router.delete("/:id", taskController.delete);
router.patch("/:id/toggle", taskController.toggleTodo);

// Routes pour le partage de tâches
router.post("/:id/share", taskController.shareTask);
router.get("/:id/shares", taskController.getTaskShares);
router.put("/:id/share/:userId", taskController.updateTaskShare);
router.delete("/:id/share/:userId", taskController.removeTaskShare);

router.post(
  "/:id/upload-image",
  authenticateJWT,
  upload.single("image"),
  (req: Request, res: Response) => taskController.uploadImage(req, res)
);

router.post(
  "/:id/upload-audio",
  authenticateJWT,
  upload.single("audio"),
  (req: Request, res: Response) => taskController.uploadAudio(req, res)
);

// Routes pour l'archivage des tâches
router.patch("/:id/archive", taskController.archive);
router.patch("/:id/unarchive", taskController.unarchive);

// Debug route to test if routing is working
router.get("/test", (req: Request, res: Response) => {
  console.log('Test route called');
  res.json({ message: "Test route working" });
});

export default router;


