import { Router } from "express";
import pool from "../Database/db.js"
const utvonal = Router();

utvonal.get("/",async(req,res)=>{
    let sql="SELECT onnan.kod, ova.kod, TIME_FORMAT(ADDTIME(jaratok.indulas, SEC_TO_TIME(jaratok.idotartam * 60)), '%H:%i')AS indulas, jaratok.jaratszam FROM jaratok LEFT JOIN repuloterek AS onnan ON jaratok.honnan_id = onnan.id LEFT JOIN repuloterek AS ova ON jaratok.hova_id = ova.id;";
    let [eredmeny]=await pool.query(sql)
    
    if(eredmeny.length === 0){
        return res.status(404).send("Nincs ilyen lehetőség!")
    }
    
    return res.json(eredmeny)


});


export default utvonal;