const help = require("./cmd");
const update = require("./update");
const express = require("express");
const server = express();

server.get("/", (req,res) => {
  res.send("Server is On");
});

server.post("/cmd", (req,res) => {
	res.header("Access-Control-Allow-Origin", "https://sepcod.com");
	res.json(help);
	res.end();
});

server.post("/update", (req,res) => {
	res.header("Access-Control-Allow-Origin", "https://sepcod.com");
	res.json(update);
	res.end();
});

function keepAlive(){
  server.listen(3001);
}

module.exports = keepAlive;