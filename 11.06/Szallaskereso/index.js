import express from "express"
import szallasok from "./routes/getszallasok.js"
import varosok  from "./routes/getvarosok.js";
import orszagok from "./routes/getorszagok.js";
import ajanlat from "./routes/getajanlat.js";
import legjobb from "./routes/getlegjobb.js";
const app= express();

app.use("/szallasok",szallasok)
app.use("/varosok",varosok)
app.use("/orszagok",orszagok)
app.use("/ajanlat",ajanlat)
app.use("/legjobb",legjobb)


app.listen(3000,()=>{
    console.log("http://localhost:3000")
})