import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | undefined => {
  console.log('authenticateJWT called for path:', req.path);
  const authHeader = req.headers.authorization;
  console.log('authHeader:', authHeader);
  if (!authHeader) {
    console.log('No auth header found');
    return res.status(401).json({ error: "Token manquant" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || !parts[1]) {
    console.log('Token malformed, parts:', parts);
    return res.status(401).json({ error: "Token mal formé" });
  }

  const token: string = parts[1]; // TS est sûr maintenant que c'est un string
  console.log('Token extracted:', token.substring(0, 20) + '...');

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown;
    console.log('Token decoded successfully:', decoded);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "id" in decoded &&
      "role" in decoded
    ) {
      req.user = { id: (decoded as any).id, role: (decoded as any).role };
      console.log('User set in request:', req.user);
      next();
      return undefined;
    } else {
      console.log('Token structure invalid');
      return res.status(403).json({ error: "Token invalide" });
    }
  } catch (error) {
    console.log('Token verification failed:', error);
    return res.status(403).json({ error: "Token invalide" });
  }
};
