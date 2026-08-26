import type { Request, Response } from "express";
import { getStructuredRecommendations } from "../service/langchain.service.js";
import { RecommendRequestSchema } from "../schemas/movie.schema.js";
import { enrichMoviesWithTmdb } from "../service/tmdb.service.js";
import { TtlCache } from "../lib/ttl-cache.js";
import { runtimeConfig } from "../config/runtime.js";

type CachedRecommendation = { movies: Awaited<ReturnType<typeof enrichMoviesWithTmdb>> };
const recommendationCache = new TtlCache<string, CachedRecommendation>(
    runtimeConfig.recommendationCacheTtlMs,
    runtimeConfig.cacheMaxEntries,
);


export async function recommendedMovies(req: Request, res: Response){
    const parsedRequest = RecommendRequestSchema.safeParse(req.body)

    if (!parsedRequest.success) {
        res.status(400).json({
            error: "Invalid request payload",
            details: parsedRequest.error.flatten().fieldErrors
        })
        return
    }

    const cacheKey = JSON.stringify(parsedRequest.data);
    const cached = recommendationCache.get(cacheKey);
    if (cached) {
        res.set("X-Cache", "HIT").json(cached);
        return;
    }

    try {
        const result = await getStructuredRecommendations(parsedRequest.data)
        const movies = await enrichMoviesWithTmdb(result.movies)

        const response = { ...result, movies };
        recommendationCache.set(cacheKey, response);
        res.set("X-Cache", "MISS").json(response)
        
    } catch (error) {
        console.error(JSON.stringify({
            event: "recommendation_failed",
            requestId: res.getHeader("X-Request-Id"),
            errorType: error instanceof Error ? error.name : "UnknownError",
        }));
        res.status(503).json({
            error: "Unable to create recommendations right now",
            requestId: res.getHeader("X-Request-Id"),
        })
        
    }
}
