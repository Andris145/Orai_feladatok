import { Router } from "express";
import pool from "../data/db.js"
const kezelesekget = Router();

kezelesekget.post("/",async(req,res)=>{
    let { allatId,leiras,dij,datum } = req.body
    let hibak = [];
    let ujdatum = datum;
    try {
    
        if(!Number.isInteger(allatId) || allatId < 1){
            hibak.push("Hibás állat id!");
        }
        if(typeof leiras !== "string"){
            hibak.push("Add meg a leírást!");
        }
        if(!Number.isInteger(dij) || dij < 0){
            hibak.push("A díj nem lehet negatív!");
        }

        if(ujdatum == null){
            ujdatum = new Date().toISOString().slice(0, 10);

        } else {
            let d = new Date(datum);

            if(typeof datum !== "string" || isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== datum){
                hibak.push("Hibás dátum!");
            }

        }

        if(hibak.length > 0){
            return res.status(400).json({ hibak: hibak });
        }

        let allatSql = "SELECT id FROM allatok WHERE id = ?;";
        let [allat] = await pool.query(allatSql, [allatId]);

        if(allat.length === 0){
            return res.status(404).json("Nincs ilyen állat");
        }

        let besz = "INSERT INTO kezelesek (allat_id, datum, leiras, dij) VALUES (?, ?, ?, ?);";
        let [beszuras] = await pool.query(besz, [allatId, ujdatum, leiras.trim(), dij])

        let sql = "SELECT kezelesek.id, DATE_FORMAT(kezelesek.datum, '%Y-%m-%d') AS datum, allatok.nev AS allat, allatok.faj, gazdak.nev AS gazda, kezelesek.leiras, kezelesek.dij FROM kezelesek LEFT JOIN allatok ON kezelesek.allat_id = allatok.id LEFT JOIN gazdak ON allatok.gazda_id = gazdak.id WHERE kezelesek.id = ?;";
        let [eredmeny] = await pool.query(sql, [beszuras.insertId]);

        return res.status(201).json(eredmeny[0]);
    } catch (error) {
        return res.json("Hiba van")
    }
})


export default kezelesekget