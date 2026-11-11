import { Router } from "express";
import pool from "../data/db.js"
const statisztika = Router();

statisztika.get("/fajok", async (req,res)=>{
    try {
        let sql = "SELECT allatok.faj, COUNT(DISTINCT allatok.id) AS allatDb, COUNT(kezelesek.id) AS kezelesDb, SUM(kezelesek.dij) AS bevetel FROM allatok LEFT JOIN kezelesek ON allatok.id = kezelesek.allat_id GROUP BY allatok.faj ORDER BY bevetel DESC;";
        let [eredmeny] = await pool.query(sql);

        return res.json(eredmeny);
    } catch (error) {
        return res.json("Hiba van")
    }
})

statisztika.get("/havi",async(req,res)=>{
    try {
        let sql = "SELECT DATE_FORMAT(kezelesek.datum, '%Y-%m') AS honap, COUNT(kezelesek.id) AS kezelesDb, SUM(kezelesek.dij) AS bevetel FROM kezelesek GROUP BY honap ORDER BY honap;";
        let [eredmeny] = await pool.query(sql);

        return res.json(eredmeny);
    } catch (error) {
        return res.json("Hiba van")
    }
})

statisztika.get("/gazdak",async(req,res)=>{
    try {
        
        let sql = "SELECT gazdak.nev AS gazda, COUNT(DISTINCT allatok.id) AS allatDb, COALESCE(SUM(kezelesek.dij), 0) AS osszKoltes FROM gazdak LEFT JOIN allatok ON gazdak.id = allatok.gazda_id LEFT JOIN kezelesek ON allatok.id = kezelesek.allat_id GROUP BY gazdak.id, gazdak.nev ORDER BY osszKoltes DESC;";
        let [eredmeny] = await pool.query(sql);

        return res.json(eredmeny);
    } catch (error) {
        return res.json("Hiba van")
    }
})

export default statisztika;