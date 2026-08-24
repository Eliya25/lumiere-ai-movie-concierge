import type { Request, Response } from "express";
import { getStructuredRecommendations } from "../service/langchain.service.js";
import { RecommendRequestSchema } from "../schemas/movie.schema.js";
import { enrichMoviesWithTmdb } from "../service/tmdb.service.js";


export async function recommendedMovies(req: Request, res: Response){
    const parsedRequest = RecommendRequestSchema.safeParse(req.body)

    if (!parsedRequest.success) {
        res.status(400).json({
            error: "Invalid request payload",
            details: parsedRequest.error.flatten().fieldErrors
        })
        return
    }

    try {
        const result = await getStructuredRecommendations(parsedRequest.data)
        const movies = await enrichMoviesWithTmdb(result.movies)

        res.json({ ...result, movies })
        
    } catch (error) {
        console.error("Recommendation request failed", error)
        res.status(500).json({error: "Unable to create recommendations right now"})
        
    }
}
