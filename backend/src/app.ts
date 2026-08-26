import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { recommendRouter } from "./routes/recommended.routes.js";
import { runtimeConfig } from "./config/runtime.js";

export const app = express();
const allowedOrigins = new Set(runtimeConfig.corsAllowedOrigins);

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use((_req, res, next) => {
    res.set({
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        "X-Request-Id": randomUUID(),
    });
    next();
});
app.use(cors({
    origin(origin, callback) {
        callback(null, !origin || allowedOrigins.has(origin));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    exposedHeaders: ["RateLimit", "RateLimit-Policy", "Retry-After", "X-Cache", "X-Request-Id"],
}));
app.use(express.json({ limit: "16kb" }));
app.use("/api/recommend", recommendRouter);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const syntaxError = error instanceof SyntaxError && "body" in error;
    res.status(syntaxError ? 400 : 500).json({
        error: syntaxError ? "Invalid JSON payload" : "Unexpected server error",
    });
});

export default app;
