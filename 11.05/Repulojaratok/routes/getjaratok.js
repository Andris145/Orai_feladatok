import { Router } from "express";
import pool from "../Database/db.js"
const jaratok = Router();

jaratok.get("/", async (req,res)=>{
    const { honnan,hova,legitarsasag} = req.query;
    let [eredmeny]=[];
    let sql ="";

    if(honnan!=null && hova!=null ){
        sql = "SELECT jaratszam FROM jaratok LEFT JOIN repuloterek AS onnan ON jaratok.honnan_id = onnan.id LEFT JOIN repuloterek AS ova ON jaratok.hova_id = ova.id WHERE onnan.kod = ? AND ova.kod = ?;";
        
        [eredmeny] = await pool.query(sql, [honnan.toLowerCase(),hova.toLowerCase()])
        return res.json(eredmeny)
    }
    if(honnan!=null || hova!=null){
        return res.status(400).json("Meg kell adni a honnan és hova paramétereket!")
    }

    if(legitarsasag != null){
        sql ="SELECT legitarsasagok.kod,legitarsasagok.nev FROM jaratok Left JOIN legitarsasagok ON legitarsasagok.id = jaratok.legitarsasag_id WHERE legitarsasagok.kod = ?;";
        
        [eredmeny]= await pool.query(sql,[legitarsasag])
        return res.json(eredmeny)
    }

    sql = "SELECT * FROM jaratok";
    [eredmeny]= await pool.query(sql)
    return res.json(eredmeny)

});

jaratok.get("/:jaratszam",async (req,res)=>{
    const {jaratszam}= req.params;
    let sql = "SELECT * FROM jaratok WHERE jaratszam = ?;";
    let [eredmeny] = await pool.query(sql,[jaratszam])

    if(eredmeny.length===0){
        return res.status(404).send("Nincs ilyen járat")
    }
    return res.json(eredmeny)
});


export default jaratok;