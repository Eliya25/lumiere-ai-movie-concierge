import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { recommendRouter } from './routes/recommended.routes.js';

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/recommend", recommendRouter)

app.get("/health", (_req, res) =>{
    res.json({status: "ok"})
})

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server connecting succssfully on port:${port}`)
})

