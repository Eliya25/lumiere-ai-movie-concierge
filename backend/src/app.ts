import express from "express";
import cors from "cors";
import { recommendRouter } from "./routes/recommended.routes.js";

export const app = express();

app.use(cors({ exposedHeaders: ["RateLimit", "RateLimit-Policy", "Retry-After", "X-Cache"] }));
app.use(express.json());
app.use("/api/recommend", recommendRouter);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

export default app;
