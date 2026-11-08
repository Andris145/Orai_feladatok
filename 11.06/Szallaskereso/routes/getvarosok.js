import { Router } from "express";
import pool from "../database/db.js"
const varosok = Router();

varosok.get("/", async (req, res)=>{
    let {minSzallas} = req.query;
    try {
        let sql="SELECT szallasok.varos_id, varosok.nev, varosok.orszag, COUNT(szallasok.id) AS szallasDb, MIN(szallasok.ar) AS legolcsobb, ROUND(AVG(szallasok.ar)) AS atlagAr FROM `szallasok` LEFT JOIN varosok ON szallasok.varos_id = varosok.id GROUP BY szallasok.varos_id,varosok.nev,varosok.orszag ORDER BY varosok.nev ASC";
        let [eredmeny] = await pool.query(sql)
        
        if(minSzallas != null){
            sql="SELECT COUNT(szallasok.id) AS szallasDb, varosok.nev FROM varosok LEFT JOIN szallasok ON szallasok.varos_id = varosok.id GROUP BY varosok.id, varosok.nev HAVING szallasDb >= 2;";
            [eredmeny] = await pool.query(sql,[minSzallas])

            return res.json(eredmeny)
        }
        
        return res.json(eredmeny)
    } catch (error) {
        return res.json("Hiba történt!")
    }
})

varosok.get("/:id/szallasok", async (req,res)=>{
    const { id } = req.params;
    try {
        let sql ="SELECT id FROM varosok WHERE id = ?;";
        let [eredmeny] = await pool.query(sql,[id]) 

        if(eredmeny.length===0){
            return res.status(404).json("Nincs ilyen város!")
        }

        sql="SELECT * FROM szallasok WHERE varos_id = ?;";

        let [szallas] = await pool.query(sql,[id])
        return res.json(szallas)
    } catch (error) {
        return res.json("Hiba történt!")
    }
})

export default varosok;