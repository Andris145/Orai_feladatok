import { Router } from "express";
import pool from "../data/db.js"
const kezelesek = Router();


kezelesek.get("/", async (req,res)=>{
    const { tol, ig, faj } = req.query;

    try {
        let sql = "SELECT kezelesek.id, DATE_FORMAT(kezelesek.datum, '%Y-%m-%d') AS datum, kezelesek.leiras, kezelesek.dij, allatok.nev AS allat, allatok.faj FROM kezelesek LEFT JOIN allatok ON kezelesek.allat_id = allatok.id WHERE kezelesek.datum BETWEEN ? AND ? AND allatok.faj = ? ORDER BY kezelesek.datum;";
        let [eredmeny] = await pool.query(sql, [tol, ig, faj]);

        return res.json(eredmeny);
    } catch (error) {
        return res.json("Hiba van")
    }
})

export default kezelesek;