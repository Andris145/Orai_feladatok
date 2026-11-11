import { Router } from "express";
import pool from "../data/db.js"
const allatok = Router();

allatok.get("/", async (req,res)=>{
    let {faj} = req.query;

    try {
        
        let sql = "SELECT allatok.id, allatok.nev, allatok.faj, DATE_FORMAT(allatok.szuletes, '%Y-%m-%d') AS szuletes, gazdak.nev AS gazda FROM allatok LEFT JOIN gazdak ON allatok.gazda_id = gazdak.id WHERE allatok.faj = ?;";
        let [eredmeny] = await pool.query(sql, [faj]);

        return res.json(eredmeny)
    } catch (error) {
     return res.json("Hiba van")   
    }
})

allatok.get("/kezeles-nelkul", async (req,res)=>{
    try {

        let sql = "SELECT allatok.id, allatok.nev, allatok.faj, gazdak.nev AS gazda FROM allatok LEFT JOIN gazdak ON allatok.gazda_id = gazdak.id LEFT JOIN kezelesek ON allatok.id = kezelesek.allat_id WHERE kezelesek.id IS NULL;";
        let [eredmeny] = await pool.query(sql);

        return res.json(eredmeny);
    } catch (error) {
        return res.json("Hiba van")
    }
})

allatok.get("/:id", async (req,res)=>{
    let { id } = req.params;

    try {
         if(!Number.isInteger(Number(id)) || Number(id) < 1){
            return res.status(400).json("Csak szám lehet!");
        }

        let sql = "SELECT allatok.id, allatok.nev, allatok.faj, DATE_FORMAT(allatok.szuletes, '%Y-%m-%d') AS szuletes, gazdak.id AS gazda_id, gazdak.nev AS gazda_nev, gazdak.telefon, kezelesek.id AS kezeles_id, DATE_FORMAT(kezelesek.datum, '%Y-%m-%d') AS datum, kezelesek.leiras, kezelesek.dij FROM allatok LEFT JOIN gazdak ON allatok.gazda_id = gazdak.id LEFT JOIN kezelesek ON allatok.id = kezelesek.allat_id WHERE allatok.id = ? ORDER BY kezelesek.datum;";
        let [eredmeny] = await pool.query(sql, [id]);

        if(eredmeny.length === 0){
            return res.status(404).json("Nincs ilyen állat");
        }

        let kezelesek = eredmeny.filter(x => x.kezeles_id).map(x => ({
            id: x.kezeles_id,
            datum: x.datum,
            leiras: x.leiras,
            dij: x.dij
        }));

        let osszesDij = 0;

        for (let i = 0; i < kezelesek.length; i++) {
            osszesDij = osszesDij + Number(kezelesek[i].dij);
        }

        let elso = eredmeny[0];

        return res.json({
            id: elso.id,
            nev: elso.nev,
            faj: elso.faj,
            szuletes: elso.szuletes,
            gazda: {
                id: elso.gazda_id,
                nev: elso.gazda_nev,
                telefon: elso.telefon
            },
            kezelesek: kezelesek,
            osszesDij: osszesDij
        });

    } catch (error) {
        return res.json("Hiba van")
    }
});

export default allatok;