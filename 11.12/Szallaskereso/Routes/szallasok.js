import express from "express"
import pool from "../database/db.js";
const szallasok = express.Router()

szallasok.get("/", async (req,res)=>{
    let {varos,minCsillag,maxAr,medence}=req.query
    let szurok = [];
    let [eredmeny] = [];

    try {

        if (minCsillag > 5) {
            return res.status(400).json({ hiba: "A megadott minimum értékelés túl nagy!" });
        }
    
        if (medence !== "true" || medence !== "false") {
            return res.status(400).json({ hiba: "A megadott érték nem megfelelő!" });
        }
    
        if (varos) {
            params.push(varos);
            szurok.push("varosok.nev = ?");
        }
    
        if (medence) {
            params.push(medence === "true" ? 1 : 0);
            szurok.push("szallasok.medence = ?");
        }
    
        if (minCsillag) {
            params.push(Number(minCsillag));
            szurok.push("szallasok.ertekeles >= ?");
        }
    
        if (maxAr) {
            params.push(Number(maxAr));
            szurok.push("szalasok.ar <= ?");
        }
    
        let sql = 'SELECT szallasok.id, szallasok.nev, varosok.nev, varosok.orszag, szallasok.csillag, szallasok.ar, CASE WHEN szallasok.medence = 0 THEN "False" WHEN szallasok.medence = 1 THEN "True" END AS medence, szallasok.ertekeles FROM `szallasok` LEFT JOIN varosok ON varosok.id = szallasok.varos_id';
        
    
        if (szurok.length > 0) {
            sql += ` WHERE ${szurok.join(' AND ')}`;
        }
    
        sql += " ORDER BY szallasok.ar"

        [eredmeny] = await pool.query(sql)

        return res.status(200).json(eredmeny)
    } catch (error) {
        return res.status(500).json("Hiba történt!")
    }
})


export default szallasok;