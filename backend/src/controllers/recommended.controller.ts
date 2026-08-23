import type { Request, Response } from "express";
import { getStructuredRecommendations } from "../service/langchain.service.js";


export async function recommendedMovies(req: Request, res: Response){
    try {
        const {
            userPrompt = "Suggest movies for a rainy night",
            genre = "thriller",
            mode = "relaxed",
            count = 2
        } = req.body;

        const result = await getStructuredRecommendations({
            userPrompt,genre,mode, count : Number(count)
        })

        res.json(result)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Something goes wrong"})
        
    }
}