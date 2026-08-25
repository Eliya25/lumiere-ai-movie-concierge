import {z} from "zod"

// zod = ts first schema validation library
//langchain = zod to define the EXACT shape of the ai output

export const MovieSchema = z.object({
    title : z.string().describe("Movie Title"),
    //ts - langchain seed this descriptions to the model
    //model will know each filed should contain what
    year : z.number().describe("Release Year"),
    genre : z.array(z.string()).describe("List of genre"),
    cast : z.array(z.string()).describe("Top 3 cast members"),
    reason : z.string().describe("why this matches the user's mood and preference"),
    rating : z.number().min(1).max(10).describe("IMDB style rating out of 10") 
})

export const RecommendationsSchema = z.object({
    movies : z.array(MovieSchema).min(1).max(6).describe("List of recommended movies")
})

export const RecommendRequestSchema = z.object({
    userPrompt: z.string().trim().min(12).max(500),
    genre: z.string().trim().min(1).max(50),
    mode: z.string().trim().min(1).max(50),
    count: z.number().int().min(1).max(6),
    excludeTitles: z.array(z.string().trim().min(1).max(150)).max(24).optional(),
    refinement: z.string().trim().min(1).max(120).optional()
}).strict()

export type Movie = z.infer<typeof MovieSchema>

export type Recommendation = z.infer<typeof RecommendationsSchema>

export type RecommendRequest = z.infer<typeof RecommendRequestSchema>
