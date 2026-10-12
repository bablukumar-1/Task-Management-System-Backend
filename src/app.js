import express from "express"
import  healthCheckRouter  from "./routes/healthcheck.routes.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    methods:["GET","POST","DELETE","UPDATE","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/user", authRouter)


export default app;  