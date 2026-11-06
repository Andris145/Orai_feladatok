import express from "express"
import szallasok from "./routes/getszallasok.js"
import varosok  from "./routes/getvarosok.js";

const app= express();

app.use("/szallasok",szallasok)
app.use("/varosok",varosok)

app.listen(3000,()=>{
    console.log("http://localhost:3000")
})