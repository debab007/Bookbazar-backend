const express = require("express")   //importing express
const app= express();               //creating an instance of express named app

app.use("/hello",(req,res)=>{
    res.send("Namaste Node!")
});

app.listen(7777, ()=>{console.log("server is sucesfully running")})



