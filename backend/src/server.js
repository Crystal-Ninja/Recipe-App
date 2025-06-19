import express, { response } from "express"
import { ENV } from "./config/env.js";
import {db} from "./config/db.js"
import { favoriteTable } from "./db/schema.js";
import job from "./config/cron.js";

import { and,eq } from "drizzle-orm";
const app=express()
const PORT = ENV.PORT || 8001;

if(ENV.NODE_ENV==="production") job.start()
app.use(express.json())
app.get("/api/health",async (req,res) => {
    res.status(200).json({success:true})    
})

app.post("/api/favorites",async (req,res) => {
    try {
        
        const {userId,recipeId,servings,title ,image,cookTime}=req.body
        
        if(!userId ||!recipeId || !title){
            return res.status(400).json({error:" missing required fields"})
        }

        const newFavorite= await db.insert(favoriteTable).values({
            userId,
            recipeId,
            servings,
            title,
            image,
            cookTime,
        }).returning()

        res.status(201).json(newFavorite[0])
    } catch (error) {
        console.log("error adding favorite",error);
        res.status(500).json({error:"something went wrong"})
    }
})

app.get("/api/favorites/:userId",async (req,res) => {
    try {
        const{userId}=req.params;

        const userFavorite= await db.select().from(favoriteTable).where(eq(favoriteTable.userId,userId))

        res.json(userFavorite)
    } catch (error) {
        console.log("error fetching a favorite",error);
        res.status(500).json({error:"something went wrong"})

    }
})

app.delete("/api/favorites/:userId/:recipeId",async (req,res) => {
    try {
        const{userId,recipeId}=req.params

        await db.delete(favoriteTable).where(
            and(eq(favoriteTable.userId,userId),eq(favoriteTable.recipeId,parseInt(recipeId)))
        )

        res.status(200).json({message:"favorite removed successfully"})

    } catch (error) {
        console.log("error removing favorite",error);
        res.status(500).json({error:"something went wrong"})
    }
})

app.listen(PORT,() => {
    console.log("server is running on PORT:",PORT);
})





// {
//     "userId":"12",
//     "recipeId":"11",
//     "servings":"6",
//     "title":"mutton",
//     "image":"images.com",
//     "cookTime":"30min"
// }