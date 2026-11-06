import express from "express"
import jaratok from "./routes/getjaratok.js";
import repuloterek from "./routes/getrepuloterek.js";  
import legitarsasagok from "./routes/getlegitarsasagok .js";
import utvonal from  "./routes/getutvonal.js";
const app = express();

app.use("/jaratok",jaratok);
app.use("/repuloterek",repuloterek)
app.use("/legitarsasagok",legitarsasagok)
app.use("/utvonal",utvonal)


app.listen(3000,()=>{
    console.log("http://localhost:3000")
})