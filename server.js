const help = require("./cmd");
const express = require("express");
const server = express();

server.get("/", (req,res) => {
  res.send("Server is On");
});

server.get("/cmd", (req,res) => {
	res.header("Access-Control-Allow-Origin", "*");
  res.write("<!Doctype html>");
  res.write("<head><meta charset=\"UTF-8\"><title>Commands</title></head>");
  res.write("<body>"+JSON.stringify(help,null,2)+"</body>");
  res.end();
});

function keepAlive(){
  server.listen(3001);
}

module.exports = keepAlive;