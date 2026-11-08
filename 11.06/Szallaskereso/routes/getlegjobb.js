import { Router } from "express";
import pool from "../database/db.js"
const legjobb =Router();

legjobb.get("/:id",async(req,res)=>{
    const { id } = req.params

    try {
        
        let sql = "SELECT szallasok.nev, szallasok.ertekeles FROM szallasok ORDER BY szallasok.ertekeles DESC LIMIT ?";
        let [eredmeny] = await pool.query(sql, [Number(id)]);
        return res.json(eredmeny);

    } catch (error) {
        return res.json("Hiba történt!")
    }
})


export default legjobb;