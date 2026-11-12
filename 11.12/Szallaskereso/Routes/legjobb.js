import express from "express"
import pool from "../database/db.js";
const legjobb = express.Router()

legjobb.get("/:id",async(req,res)=>{
    let {id} = req.params
    try {
        
        let sql="SELECT szallasok.nev, szallasok.ertekeles FROM szallasok ORDER BY szallasok.ertekeles DESC LIMIT ?;";
        let [eredmeny] = await pool.query(sql,[Number(id)])

        return res.status(200).json(eredmeny)
    } catch (error) {
        return res.status(500).json("Hiba a szervernél!")
    }
})

export default legjobb;