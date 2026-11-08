import { Router } from "express";
import pool from "../database/db.js"
const orszagok = Router();

orszagok.get("/", async (req,res)=>{
    try {

        let sql="SELECT varosok.orszag, COUNT(DISTINCT varosok.id) AS varosDb, COUNT(szallasok.id) AS szallasDb, ROUND(AVG(szallasok.ertekeles), 2) AS atlagErtekeles FROM varosok LEFT JOIN szallasok ON szallasok.varos_id = varosok.id GROUP BY varosok.orszag ORDER BY varosok.orszag ASC;";
        let [eredmeny] = await pool.query(sql)

        return res.json(eredmeny)
    } catch (error) {
        return res.json("Hiba történt!")
    }


})

export default orszagok;