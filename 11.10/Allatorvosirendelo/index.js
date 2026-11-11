import express from "express"
import gazdak from "./routes/getgazdak.js";
import allatok from "./routes/allatok.js";
import kezelesek from "./routes/kezelesek.js";
import statisztika from "./routes/statisztika.js";
import kezelesekget from "./routes/kezelesekpost.js" 
const app = express();

app.use("/gazdak",gazdak)
app.use("/allatok",allatok)
app.use("/kezelesek",kezelesek)
app.use("/statisztika",statisztika)
app.use("/kezelesek",kezelesekget)

app.listen(3000,()=>{
    console.log("http://localhost:3000")
})