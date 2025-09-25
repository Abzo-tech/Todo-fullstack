import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import TaskRoute from "./routes/TaskRoute.js";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import path from "path";

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});
const port = 3000;

// Configuration CORS pour permettre les requêtes du frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use("/tasks", TaskRoute);
app.use("/users", UserRoute);
app.use("/auth", AuthRoute);
app.use("/assets", express.static(path.join(process.cwd(), "assets")));

// Configuration Socket.io
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);

  // Écouter les événements du client
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Utilisateur ${userId} rejoint la room user_${userId}`);
  });

  socket.on('leave', (userId) => {
    socket.leave(`user_${userId}`);
    console.log(`Utilisateur ${userId} quitte la room user_${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

// Fonction pour émettre des notifications
export const emitNotification = (userId: number, event: string, data: any) => {
  io.to(`user_${userId}`).emit(event, data);
};

// Page d'accueil
app.get("/", (_req: express.Request, res: express.Response) => {
  res.send("Bienvenue dans l'API ToDo 🚀 - utilisez /tasks ou /users");
});

// Middleware 404 (doit être **après toutes les routes**)
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: `Route non trouvée: ${req.originalUrl}` });
});

server.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port} avec Socket.io`);
});
