import express from "express"
import pool from "../database/db.js";
const ajanlat = express.Router()

ajanlat.get("/",async(req,res)=>{
    let {ej,fo,varos} = req.query;
    const hibak = [];

    try {

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
            return res.status(404).json({ hibak: hibak });
        }

        let sql = "SELECT szallasok.nev AS szallas, szallasok.csillag, szallasok.ar AS arFoEj, szallasok.ar * ? * ? AS osszesen FROM szallasok JOIN varosok ON szallasok.varos_id = varosok.id WHERE varosok.nev = ? ORDER BY szallasok.ar ASC;"
        let[eredmeny] = await pool.query(sql,[ej,fo,varos])

        let kispista = {
            varos:varos,
            ej: Number(ej), 
            fo: Number(fo), 
            ajanlatok: eredmeny
        };

        return res.status(200).json(kispista)
    } catch (error) {
        return res.status(500).json("Hiba a szervernél!")
    }
})

export default ajanlat;