
import express from "express"

const app=express()

import dotenv from "dotenv"
import router from "./routes/api.js";
import fileUpload from "express-fileupload"


dotenv.config();

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use("/api/",router)

app.use(fileUpload())


const port=process.env.PORT;

app.get("/",(req,res)=>{
    res.send("index");
})


app.listen(port,()=>{console.debug(`Server is running on port ${port}`)});