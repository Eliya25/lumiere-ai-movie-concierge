function positiveInteger(name: string, fallback: number) {
    const value = Number(process.env[name]);
    return Number.isInteger(value) && value > 0 ? value : fallback;
}

export const runtimeConfig = {
    rateLimitWindowMs: positiveInteger("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
    rateLimitMax: positiveInteger("RATE_LIMIT_MAX", 20),
    recommendationCacheTtlMs: positiveInteger("RECOMMENDATION_CACHE_TTL_MS", 10 * 60 * 1000),
    tmdbCacheTtlMs: positiveInteger("TMDB_CACHE_TTL_MS", 24 * 60 * 60 * 1000),
    cacheMaxEntries: positiveInteger("CACHE_MAX_ENTRIES", 500),
};
