import express from "express";
import cmd from "../data/command";
import update from "../data/update";
import http from "http";
import config from "../config/secret";
const server = express();

server.set("port", 443);
server.get("/", (req,res) => {
  res.send("Hello, World!");
});

server.post("/cmd", (req,res) => {
	res.header("Access-Control-Allow-Origin", "https://sepcod.com");
	res.json(cmd);
	res.end();
});

server.post("/update", (req,res) => {
	res.header("Access-Control-Allow-Origin", "https://sepcod.com");
	res.json(update);
	res.end();
});
export default function keepAlive():void{
  var site = http.createServer(server);
  site.listen(config.port, () => console.log("Sepbot is running on port :",config.port));
}