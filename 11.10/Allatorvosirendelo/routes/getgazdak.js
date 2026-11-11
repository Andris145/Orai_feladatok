import { Router } from "express";
import pool from "../data/db.js"
const gazdak = Router();

gazdak.get("/", async (req,res)=>{
    const { varos } = req.query;
    let sql="";
    let[eredmeny] = []

    try {

        sql="SELECT gazdak.id,gazdak.nev,gazdak.varos, COUNT(allatok.id) AS allatDb FROM `gazdak` LEFT JOIN allatok ON gazdak.id = allatok.gazda_id GROUP BY gazdak.id, gazdak.nev, gazdak.varos;";
        [eredmeny] = await pool.query(sql)

        if(varos != null){

            sql = "SELECT DISTINCT gazdak.nev FROM gazdak LEFT JOIN allatok ON gazdak.id = allatok.gazda_id WHERE gazdak.varos = ?;";
            [eredmeny] = await pool.query(sql,[varos])

            return res.type('text/plain').send(eredmeny.map(x => x.nev).join(', '));
        }
        return res.json(eredmeny)
    } catch (error) {
        return res.json("Óriási hiba van!")   
    }
})


gazdak.get("/:id",async(req, res)=>{
    let { id } = req.params;

    try {

        if(!Number.isInteger(Number(id)) || Number(id) < 1){
            return res.status(400).json("Csak szám lehet!");
        }
        

        let sql="SELECT gazdak.id as gazda_id, gazdak.nev as gazda_nev, gazdak.telefon, gazdak.varos, allatok.nev as allat_nev, allatok.faj, allatok.szuletes FROM gazdak LEFT JOIN allatok ON gazdak.id = allatok.gazda_id WHERE gazdak.id = ?;";
        let [eredmeny] = await pool.query(sql,[id])

        if(eredmeny.length === 0){
            return res.status(404).json("Nincs ilyen gazda");
        }

        return res.json({
            id:eredmeny[0].gazda_id,
            nev:eredmeny[0].gazda_nev,
            telefon:eredmeny[0].telefon,
            varos:eredmeny[0].varos,
            allatok:eredmeny.filter(x=>x.allat_id).map(x=>({
                id:x.allat_id,
                nev:x.allat_nev,
                faj:x.faj,
                szuletes:x.szuletes
            }))
        })


    } catch (error) {
        return res.json("Hiba van")
    }
    
})

export default gazdak;