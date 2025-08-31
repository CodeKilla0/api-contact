"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const client_1 = require("@prisma/client");
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Routes
const contact_route_1 = __importDefault(require("./v1/contact/contact.route"));
const PORT = process.env.PORT || 3000;
exports.prisma = new client_1.PrismaClient();
exports.app = (0, express_1.default)();
// ===== Configuration Socket IO =====
const server = http_1.default.createServer(exports.app);
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
exports.app.use(express_1.default.json({ limit: "2mb" }));
exports.app.use(express_1.default.urlencoded({ extended: true, limit: "2mb" }));
// Rate limiting
exports.app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 300, // Limite à 300 requêtes par IP par fenêtre de 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard.",
}));
// ===== ROUTES =====
exports.app.use("/api/v1/contacts", contact_route_1.default);
// ===== Route de test =====
exports.app.get("/", (_req, res) => {
    res.json({ message: "Contacts service is running" });
});
// ===== Gestion des erreurs globales =====
exports.app.use((err, _req, res, _next) => {
    console.error("💥 Internal Error:", err);
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Erreur interne du serveur",
    });
});
// ===== Catch process errors non gérées =====
process.on("unhandledRejection", (err) => {
    console.error("Unhandled rejection:", err.message);
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err.message);
    process.exit(1);
});
// ===== Start server =====
server.listen(PORT, () => {
    console.log(`🚀 API + WebSocket en ligne sur http://localhost:${PORT}`);
});
