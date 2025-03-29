import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from 'cors';
import * as allRoutes from './modules/index.route.js';
import connection from "./DB/connection.js";
const app = express();


// Middleware
app.use(express.json());
app.use(cors());

//Api routes
const baseUrl = process.env.BASE_URL
app.use(`${baseUrl}/auth`,allRoutes.authRouter);
app.use(`${baseUrl}/user`,allRoutes.userRouter);
app.use(`${baseUrl}/income`,allRoutes.incomeRouter);
app.use(`${baseUrl}/expense`,allRoutes.expenseRouter);
app.use(`${baseUrl}/member`,allRoutes.memberRouter);
app.use(`${baseUrl}/statistics`,allRoutes.statisticsRouter);
app.get('*',(req,res)=>{
    res.status(403).json({message:"This page not found"});
});

connection(); //call function to DB connection

//run server
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}/economy-api/v1/`);
})