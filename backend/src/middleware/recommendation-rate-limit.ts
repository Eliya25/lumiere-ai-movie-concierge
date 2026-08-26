import { rateLimit } from "express-rate-limit";
import { runtimeConfig } from "../config/runtime.js";

export const recommendationRateLimit = rateLimit({
    windowMs: runtimeConfig.rateLimitWindowMs,
    limit: runtimeConfig.rateLimitMax,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many recommendation requests. Please wait a moment and try again." },
});
