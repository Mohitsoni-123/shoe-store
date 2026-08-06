import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js"


const app = express();


//Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());




app.use("/api/auth", authRoutes)



//Test Route
app.get("/", (req, res)=>{
    res.json({
        success: true,
        message: "Shoe Store API is running",
    })
})





export default app;