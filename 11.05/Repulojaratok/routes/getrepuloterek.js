import { Router } from "express";
import pool from "../Database/db.js"
const repuloterek = Router();

repuloterek.get("/",async (req,res)=>{
    let sql="SELECT repuloterek.kod, repuloterek.nev, repuloterek.varos, repuloterek.orszag, (SELECT COUNT(*) FROM jaratok WHERE jaratok.honnan_id = repuloterek.id) AS indulo, (SELECT COUNT(*) FROM jaratok WHERE jaratok.hova_id = repuloterek.id) AS erkezo FROM repuloterek ORDER BY repuloterek.kod;";
    let [eredmeny] =await pool.query(sql)
    res.send(eredmeny)

})

repuloterek.get("/:kod",async(req,res)=>{
    const { kod }=req.params;
    let sql ="SELECT * FROM repuloterek WHERE kod= ?"; 
    let [eredmeny] =await pool.query(sql,[kod])
    if(eredmeny.length===0){
        return res.status(404).send("Nincs ilyen repülőtér!")
    }
    return res.json(eredmeny)
})

export default repuloterek;