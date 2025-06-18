import express, { response } from "express"
import { ENV } from "./config/env.js";
import {db} from "./config/db.js"
import { favoriteTable } from "./db/schema.js";


const app=express()
const PORT = ENV.PORT || 8001;

app.use(express.json())
app.get("api/health",async (req,res) => {
    res.status(200).json({success:true})    
})

app.post("api/favorites",async (req,res) => {
    try {
        console.log("hi");
        
        const {userId,recipeId,servings,title ,image,cookTime}=req.body
        console.log("hello");
        
        if(!userId ||!recipeId || !title){
            return res.status(400).json({error:" missing required fields"})
        }

        const newFavorite= await db.insert(favoriteTable).values({
            userId,recipeId,servings,title ,image,cookTime,
        })

        res.status(201).json(newFavorite[0])
    } catch (error) {
        console.log("error adding favorite",error);
        res.status(500).json({error:"something went wrong"})
    }
})

app.listen(PORT,() => {
    console.log("server is running on PORT:",PORT);
})