import { Router } from "express";
import pool from "../database/db.js"
const szallasok = Router();

szallasok.get("/",async(req,res)=>{
    let { varos ,minCsillag,maxAr,medence }=req.query
    let [alma]=[]
    try {
        let sql="SELECT * FROM szallasok ORDER BY szallasok.ar ASC;";
        let [eredmeny] = await pool.query(sql)    
        

        if(varos != null){
            sql= "SELECT * FROM szallasok LEFT JOIN varosok ON szallasok.varos_id = varosok.id WHERE varosok.nev = ?;";
            [eredmeny]= await pool.query(sql,[varos])
            res.json(eredmeny)
        }
        if(minCsillag != null){
            sql="SELECT * FROM szallasok LEFT JOIN varosok ON szallasok.varos_id = varosok.id WHERE szallasok.csillag >= ?;";
            [eredmeny] = await pool.query(sql,[minCsillag])
            res.json(eredmeny)
        }
        console.log(varos,minCsillag)
        return res.json(eredmeny)
    } catch (error) {
        res.json("Hiba történt")
    }
})

szallasok.get("/:id",async(req,res)=>{
    let { id } = req.params
    try {

        let sql="SELECT * FROM szallasok WHERE id = ?;";
        let [eredmeny] = await pool.query(sql,[id])
        if(eredmeny.length === 0 || Number(id) >= 13){
            return res.status(404).json("Nincs ilyen szállás!")
        }
        
        return res.json(eredmeny)
    } catch (error) {
        return res.json("Hiba történt!")
    }
})

export default szallasok;