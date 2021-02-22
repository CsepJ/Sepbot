const express = require("express");
const server = express();


server.all('/', (req, res)=>{

   res.setHeader('Content-Type', 'text/html');
   res.write('<!DOCTYPE html><html><head><title>Server of Sepbot / Nyunbot</title><link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@1,300&display=swap" rel="stylesheet"><style>body{font-family:"Raleway", "sans-serif"}</style></head><body>SP\'s discord bot is running</body></html>');
   res.end();

})



function keepAlive(){

   server.listen(process.env.PORT, ()=>{console.log("Server is online!")});

}



module.exports = keepAlive;