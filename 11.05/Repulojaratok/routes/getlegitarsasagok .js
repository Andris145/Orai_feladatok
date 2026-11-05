import { Router } from "express";
import pool from "../Database/db.js"
const legitarsasagok = Router();

legitarsasagok.get("/",async(req,res)=>{
    let sql="SELECT legitarsasagok.kod,legitarsasagok.nev, COUNT(jaratok.id) AS jaratDb, COUNT(DISTINCT jaratok.hova_id) AS celallomasDb, MIN(jaratok.ar) AS legolcsobb, AVG(jaratok.ar) AS atlagAr FROM `jaratok` LEFT JOIN legitarsasagok ON jaratok.legitarsasag_id = legitarsasagok.id GROUP BY legitarsasagok.id, legitarsasagok.kod, legitarsasagok.nev ORDER BY jaratDb DESC, legitarsasagok.nev"

    let [eredmeny]=await pool.query(sql);
    return res.json(eredmeny)
})


export default legitarsasagok;