import {Router} from 'express'
import { recommendedMovies } from '../controllers/recommended.controller.js'
import { recommendationRateLimit } from '../middleware/recommendation-rate-limit.js'


export const recommendRouter = Router()

recommendRouter.post("/", recommendationRateLimit, recommendedMovies);
