import express from "express"
import szallasok from "./Routes/szallasok.js";
import varosok from "./Routes/varosok.js";
import orszag from "./Routes/orszagok.js";
import ajanlat from "./Routes/ajanlat.js";
import legjobb from "./Routes/legjobb.js";
const app = express();

app.use("/szallasok", szallasok)
app.use("/varosok",varosok)
app.use("/orszagok",orszag)
app.use("/ajanlat",ajanlat)
app.use("/legjobb",legjobb)

app.listen(3000,()=>{
    console.log("http://localhost:3000")
})