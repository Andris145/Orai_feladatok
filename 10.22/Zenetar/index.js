import express from "express"
import pool from "./data/db.js";

const app = express();

app.get("/eloadok", async (req, res)=>{
    let sql = "SELECT nev FROM eloadok ORDER BY nev ASC"
    let [eredmeny] = await pool.query(sql)

    res.json(eredmeny)
})

app.get("/eloadok", async (req,res)=>{
    const orsz = req.query.orszag
    try {

        let sql = "SELECT nev, orszag FROM eloadok WHERE orszag = ?"
        let [eredmeny] = await pool.query(sql,[orsz])
    
        return res.json(eredmeny)

    } catch (error) {
        console.log(error)
    }

})

app.get("/eloadok/:id", async (req,res)=>{
    let id = req.params.id;

    try {

        if(isNaN(id)){
            return res.send("Csak szám lehet")
        }


        let sql = "SELECT * FROM eloadok WHERE id = ?";
        let [eredmeny] = await pool.query(sql, [id]);

        sql="SELECT * FROM albumok WHERE eloado_id = ?"
        const [album] = await pool.query(sql,[id]);

        if(id>eredmeny) {
           return res.send("Nincs ilyen előadó")
        }
       
        eredmeny[0].albumok = album

        return res.json(eredmeny)
    } catch (error) {
        console.log(error)
    }
})

app.get("/albumok",async (req,res)=>{
    try {
       let sql = "SELECT eloadok.id,cim,eloadok.nev, ev,mufaj,hossz FROM `albumok` LEFT JOIN eloadok ON eloado_id = eloadok.id HAVING ev ORDER BY nev" 
       let [eredmeny]= await pool.query(sql)
       return res.json(eredmeny)
       
    } catch (error) {
        res.send(error)
    }
})

app.get("/albumok",async(req,res)=>{
    const { mufaj,tol,ig} = req.query;

    try {
        if (tol && isNaN(tol)) {
            return res.status(400).send("Csak szám lehet");
        }

        if (ig && isNaN(ig)) {
            return res.status(400).send("Csak szám lehet");
        }
        
        let sql = "SELECT * FROM albumok WHERE mufaj = ? AND ev >= ? AND ev <= ?";
        let [eredmeny] = await pool.query(sql, [mufaj, tol, ig]);

        return res.json(eredmeny)
    } catch (error) {
        console.log(error)
    }
})

app.get("/albumok/kereses",async (req,res)=>{
    const { q }= req.query;

    try {

        if(!q || q.lenght<2){
            return res.send("Legalább 2 karakter kell").status(400)
        }

        
        let sql = "SELECT * FROM albumok JOIN eloadok ON eloado_id = eloadok.id WHERE cim LIKE ? OR nev LIKE ?"
        let [eredmeny] = await pool.query(sql,[`%${q}%`, `%${q}%`])
        return res.json(eredmeny)

    } catch (error) {
        console.log(error)
    }
})

app.get("/mufajok",async (req,res)=>{
    try {
        let sql = "SELECT mufaj, COUNT(mufaj) as albumDb, SUM(hossz) as osszHossz FROM albumok GROUP BY mufaj"
        let [eredmeny]= await pool.query(sql)
        return res.json(eredmeny)
    } catch (error) {
        
    }
})

app.get("/statisztika/eloadok",async(req,res)=>{
    try {
        let sql ="SELECT eloadok.nev, COUNT(mufaj) as albumDB, Min(ev) as elso, Max(ev) as utolso FROM `albumok` LEFT JOIN eloadok ON eloado_id = eloadok.id GROUP BY nev ORDER BY albumDB DESC "
        let [eredmeny] = await pool.query(sql)
        return res.json(eredmeny)
    } catch (error) {
        console.log(error)
    }
})

app.get("/orszagok",async(req,res)=>{
    try {
        let sql="SELECT orszag, COUNT(DISTINCT nev) as eloadoDb,COUNT(mufaj) as albumDB FROM `eloadok` LEFT JOIN albumok ON eloadok.id = albumok.eloado_id GROUP BY orszag;"
        let [eredmeny] = await pool.query(sql)
        return res.json(eredmeny)
    } catch (error) {
        
    }
   
})

app.listen(3000,()=>{
    console.log("http://localhost:3000")
})