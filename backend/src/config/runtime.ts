function positiveInteger(name: string, fallback: number) {
    const value = Number(process.env[name]);
    return Number.isInteger(value) && value > 0 ? value : fallback;
}

function csv(name: string, fallback: string[]) {
    const value = process.env[name];
    if (!value) return fallback;

    const entries = value.split(",").map((entry) => entry.trim()).filter(Boolean);
    return entries.length > 0 ? entries : fallback;
}

export const runtimeConfig = {
    corsAllowedOrigins: csv("CORS_ALLOWED_ORIGINS", [
        "http://localhost:5173",
        "https://lumiere-ai-movie-concierge.vercel.app",
    ]),
    aiRequestTimeoutMs: positiveInteger("AI_REQUEST_TIMEOUT_MS", 45_000),
    tmdbRequestTimeoutMs: positiveInteger("TMDB_REQUEST_TIMEOUT_MS", 6_000),
    rateLimitWindowMs: positiveInteger("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
    rateLimitMax: positiveInteger("RATE_LIMIT_MAX", 20),
    recommendationCacheTtlMs: positiveInteger("RECOMMENDATION_CACHE_TTL_MS", 10 * 60 * 1000),
    tmdbCacheTtlMs: positiveInteger("TMDB_CACHE_TTL_MS", 24 * 60 * 60 * 1000),
    cacheMaxEntries: positiveInteger("CACHE_MAX_ENTRIES", 500),
};
