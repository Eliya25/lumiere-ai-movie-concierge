import {Router} from 'express'
import { recommendedMovies } from '../controllers/recommended.controller.js'


export const recommendRouter = Router()

recommendRouter.post("/", recommendedMovies);