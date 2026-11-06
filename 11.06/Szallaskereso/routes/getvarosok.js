import { Router } from "express";
import pool from "../database/db.js"
const varosok = Router();

varosok.get("/", async (req, res)=>{
    let {minSzallas} = req.query;
    try {
        let sql="SELECT szallasok.varos_id, varosok.nev, varosok.orszag, COUNT(szallasok.id) AS szallasDb, MIN(szallasok.ar) AS legolcsobb, ROUND(AVG(szallasok.ar)) AS atlagAr FROM `szallasok` LEFT JOIN varosok ON szallasok.varos_id = varosok.id GROUP BY szallasok.varos_id,varosok.nev,varosok.orszag ORDER BY varosok.nev ASC";
        let [eredmeny] = await pool.query(sql)
        
        if(minSzallas != null){
            sql="SELECT COUNT(szallasok.id) AS szallasDb ,szallasok.nev, FROM szallasok WHERE szallasDb >= ?"
            [eredmeny] = await pool.query(sql,[minSzallas])

            return res.json(eredmeny)
        }
        
        return res.json(eredmeny)
    } catch (error) {
        return res.json("Hiba történt!")
    }
})


export default varosok;