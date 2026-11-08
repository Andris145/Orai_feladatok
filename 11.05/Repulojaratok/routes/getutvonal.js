import { Router } from "express";
import pool from "../Database/db.js"
const utvonal = Router();

utvonal.get("/",async(req,res)=>{
    const { honnan,hova } = req.query;
    let [eredmeny]=[];
    let sql ="";

    if(honnan == null || hova == null || honnan.toLowerCase() == hova.toLowerCase()){
        return res.status(400).json("Meg kell adni a honnan és hova paramétereket és nem lehetnek egyformák!")
    }

    sql = "SELECT kod FROM repuloterek WHERE kod = ? OR kod = ?;";
    [eredmeny] = await pool.query(sql,[honnan,hova])
    
    if(eredmeny.length < 2){
        return res.status(404).send("Nincs ilyen lehetőség!")
    }
    
    sql = "SELECT jaratszam, TIME_FORMAT(jaratok.indulas, '%H:%i') AS indulas, TIME_FORMAT(ADDTIME(jaratok.indulas, SEC_TO_TIME(jaratok.idotartam * 60)), '%H:%i') AS erkezes, CAST(jaratok.ar AS UNSIGNED) AS ar FROM jaratok LEFT JOIN repuloterek AS onnan ON jaratok.honnan_id = onnan.id LEFT JOIN repuloterek AS ova ON jaratok.hova_id = ova.id WHERE onnan.kod = ? AND ova.kod = ? ORDER BY jaratok.ar;";
    let [kozv] = await pool.query(sql,[honnan,hova])
    
    sql = "SELECT j1.jaratszam AS elso, j2.jaratszam AS masodik, atsz.kod AS atszallas, TIME_FORMAT(j1.indulas, '%H:%i') AS indulas, TIME_FORMAT(ADDTIME(j2.indulas, SEC_TO_TIME(j2.idotartam * 60)), '%H:%i') AS erkezes, (TIME_TO_SEC(j2.indulas) - TIME_TO_SEC(j1.indulas)) / 60 - j1.idotartam AS varakozas, j1.ar + j2.ar AS osszAr FROM jaratok AS j1 LEFT JOIN jaratok AS j2 ON j2.honnan_id = j1.hova_id LEFT JOIN repuloterek AS onnan ON j1.honnan_id = onnan.id LEFT JOIN repuloterek AS atsz ON j1.hova_id = atsz.id LEFT JOIN repuloterek AS ova ON j2.hova_id = ova.id WHERE onnan.kod = ? AND ova.kod = ? HAVING varakozas BETWEEN 60 AND 300 ORDER BY osszAr;";
    let [atszallassal] = await pool.query(sql,[honnan,hova])
    
    return res.json({ honnan: honnan, hova: hova, kozvetlen: kozv, atszallassal: atszallassal })

});


export default utvonal;