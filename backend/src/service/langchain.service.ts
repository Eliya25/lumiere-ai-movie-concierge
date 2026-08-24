

import {ChatGoogle} from "@langchain/google/node";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import { RecommendationsSchema } from "../schemas/movie.schema.js";

const model = new ChatGoogle({
    model: "gemini-3.6-flash",
    temperature: 0.3 //lower the temp == more consistent it going to give les random answers
})

const promtTemplate = ChatPromptTemplate.fromMessages([
    [
        "system", 
        //system message -> who the AI is  + how it should behave send on every req before the users message
        //set the personality and ruls for the system
        `You are a movie recommendaton expert.
        
        Return high-quality recommendation based on:
        -user's request
        -genre
        -mood
        -count (return exactly this number of movies)
        
        Selection rules:
        - Return exactly the requested number of real, released feature films.
        - Treat the user's wording as the primary signal; genre and mood are supporting constraints.
        - Every selection must clearly match the requested viewing experience.
        - Prefer a coherent shortlist over novelty. Include less-obvious titles only when they are a strong match.
        - Do not invent scenes, weather, plot events, awards, cast members, release years, or ratings.
        - Explain the match using the film's tone, themes, pacing, and viewing experience.
        - Make each reason specific to the user's request, concise, and distinct from the other reasons.
        - If the user asks for a rainy-night film, interpret that as a desired viewing atmosphere unless rain is truly part of the film.
        - Use "Any genre" as no genre restriction.`

    ],
    [
        "human", //humen message -> user's request with varibales
        `User request: {userPrompt}
        
        Preferences:
        - Genre: {genre}
        - Mode: {mode}
        - Number of movies: {count}`,
    ],
]);

export async function getRecommendations(input: {userPrompt: String; genre: string; mode: string; count: number}){
    //.pipe(model) = LECL -> langchain expression langauage
    //connect components into a chain
    //input - promptTemplate -> variabales - call model (gemini) - response
    const chain = promtTemplate.pipe(model)

    const response = await chain.invoke({
        userPrompt: input.userPrompt,
        genre: input.genre,
        mode: input.mode,
        count: input.count

    })

    console.log(response.text)
    return response.text
}


// zod + structure output
const structureModel = model.withStructuredOutput(RecommendationsSchema)

export async function getStructuredRecommendations(input: {userPrompt: string; genre: string; mode: string; count: number;} ){
    const chain = promtTemplate.pipe(structureModel)

    const result = await chain.invoke({
        userPrompt: input.userPrompt,
        genre: input.genre,
        mode: input.mode,
        count: input.count

    })

    return {
        ...result,
        movies: result.movies.slice(0, input.count)
    }
}
