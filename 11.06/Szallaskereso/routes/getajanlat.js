import { Router } from "express";
import pool from "../database/db.js"
const ajanlat = Router();

ajanlat.get("/",async(req,res)=>{
    const { ej, fo,varos }=req.query;   
    
    const hibak = [];
    if(!varos === ""){
        hibak.push("A várost meg kell adni!");
    }
    if(!Number.isInteger(Number(ej)) || ej == null || ej === "" || Number(ej) < 1){
        hibak.push("Az éjszakák számának minimum 1-nek kell lenni!");
    }
    if(!Number.isInteger(Number(fo)) || fo == null || fo === "" || Number(fo) < 1){
        hibak.push("A fők számának minimum 1-nek kell lenni!");
    }
    if(hibak.length > 0){
        return res.status(400).json({ hibak: hibak });
    }
    

    try {
        let sql="SELECT szallasok.nev AS szallas, szallasok.csillag, szallasok.ar AS arFoEj, szallasok.ar * ? * ? AS osszesen FROM szallasok JOIN varosok ON szallasok.varos_id = varosok.id WHERE varosok.nev = ? ORDER BY szallasok.ar ASC;"; 
        let [eredmeny] = await pool.query(sql,[ej,fo,varos])
        return res.json({ varos: varos, ej: Number(ej), fo: Number(fo), ajanlatok: eredmeny })

    } catch (error) {
        return res.json("Hiba történt!")
    }
    
})


export default ajanlat;