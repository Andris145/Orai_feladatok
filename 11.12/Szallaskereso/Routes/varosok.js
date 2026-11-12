import express from "express"
import pool from "../database/db.js";
const varosok = express.Router()

varosok.get("/",async(req,res)=>{
        const {minSzallas}=req.query
    try {
        
        let sql ="SELECT varosok.id,varosok.nev,varosok.orszag, COUNT(szallasok.id) AS szallasDb, ROUND(AVG(szallasok.ar)) AS atlagAr,MIN(szallasok.ar) AS legolcsobb FROM varosok LEFT JOIN szallasok ON varosok.id=szallasok.varos_id GROUP BY varosok.id, varosok.nev, varosok.orszag ORDER BY varosok.nev ASC;";
        let [eredmeny]=await pool.query(sql);

        if(minSzallas!=null){
            let sql="SELECT varosok.id,varosok.nev,varosok.orszag, COUNT(szallasok.id) AS szallasDb FROM varosok LEFT JOIN szallasok ON varosok.id=szallasok.varos_id GROUP BY varosok.id, varosok.nev,varosok.orszag HAVING szallasDb >= ?;";
            let [eredmeny]=await pool.query(sql,[minSzallas])
            return res.status(200).json(eredmeny)
        }

        return res.status(200).json(eredmeny)
    } catch (error) {
        return res.status(500).json("Hiba lépett fel")
    }
})

varosok.get("/:id",async(req,res)=>{
    let {id}=req.params;

    try {

        if(eredmeny.length === 0 ){
            return res.status(404).json("Nincs ilyen város!")
        }

        let sql ="SELECT id FROM varosok WHERE id = ?;";
        let [eredmeny] = await pool.query(sql,[id])

        return res.status(200).json(eredmeny)
    } catch (error) {
        return res.status(500).json({hiba:error})
    }
})

varosok.get("/:id/szallasok",async(req,res)=>{
    const { id }=req.params
    
    try {
        
        let sql ="SELECT varosok.nev AS Varos_nev,szallasok.nev AS Szallas_nev FROM szallasok LEFT JOIN varosok ON szallasok.varos_id = varosok.id WHERE varos_id = 2;";
        let [eredmeny] = await pool.query(sql,[id]) 

        if(id > 7){
            return res.status(404).json("Nincs ilyen város!")
        }

        return res.status(200).json(eredmeny)
    } catch (error) {
        
    }
})


export default varosok;