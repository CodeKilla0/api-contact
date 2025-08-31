import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";
import http from "http";
import dotenv from "dotenv";

dotenv.config();
// Routes
import routeContact from "./v1/contact/contact.route";  


const PORT = process.env.PORT || 3000;
export const prisma = new PrismaClient();
export const app: Application = express();


// ===== Configuration Socket IO =====
const server = http.createServer(app);

// const allowedOrigins = [
//   "http://localhost:3000",
// ];

// // ===== Middleware de sécurité & performance =====
// // Sécurité des headers HTTP
// app.use(helmet({ crossOriginResourcePolicy: false }));

// // CORS plus restreint
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true); // Postman ou serveur interne
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("CORS not allowed for this origin"), false);
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// Limit payload size
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300, // Limite à 300 requêtes par IP par fenêtre de 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard.",
  })
);

// ===== ROUTES =====
app.use("/api/v1/contacts", routeContact);


// ===== Route de test =====
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Contacts service is running" });
});

// ===== Gestion des erreurs globales =====
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("💥 Internal Error:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Erreur interne du serveur",
  });
});

// ===== Catch process errors non gérées =====
process.on("unhandledRejection", (err: any) => {
  console.error("Unhandled rejection:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err: any) => {
  console.error("Uncaught exception:", err.message);
  process.exit(1);
});

// ===== Start server =====
server.listen(PORT, () => {
  console.log(`🚀 API + WebSocket en ligne sur http://localhost:${PORT}`);
});
