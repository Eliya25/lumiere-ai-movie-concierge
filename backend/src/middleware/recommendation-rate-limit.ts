import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import type { Request } from "express";
import { runtimeConfig } from "../config/runtime.js";

function clientIp(req: Request) {
    const vercelForwardedFor = req.headers["x-vercel-forwarded-for"];
    const forwardedIp = Array.isArray(vercelForwardedFor)
        ? vercelForwardedFor[0]
        : vercelForwardedFor?.split(",")[0]?.trim();

    return ipKeyGenerator(forwardedIp || req.ip || "unknown");
}

export const recommendationRateLimit = rateLimit({
    windowMs: runtimeConfig.rateLimitWindowMs,
    limit: runtimeConfig.rateLimitMax,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: clientIp,
    message: { error: "Too many recommendation requests. Please wait a moment and try again." },
});
