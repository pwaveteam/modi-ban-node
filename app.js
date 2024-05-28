import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import apiRouter from "./src/api/index.js";

// .env 파일을 로드
dotenv.config()
const app = express()
const port = 8001

/******* Options *******/
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({ origin: '*' }))

/******* Router *******/
app.use('/static', express.static('static'));
app.use('/api/v1', apiRouter)


app.listen(port, () => {
  console.log(`${process.env.TEST}`)
  console.log(`API - port : 8001`)
})
