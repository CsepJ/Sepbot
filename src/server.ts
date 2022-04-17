import { Client, Intents } from "discord.js";
import express from "express";
import cmd from "../data/command";
import update from "../data/update";
import http from "http";
import config from "../config/secret";
const server = express();
const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_PRESENCES, 
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
    Intents.FLAGS.DIRECT_MESSAGES
    ]
});
server.set("port", 443);
bot.login(config.token);
server.get("/", (req,res) => {
  res.send("Server is On");
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

server.post("/servers", (req,res) => {
  res.header("Access-Control-Allow-Origin", "https://sepcod.com");
  let serverCount = bot.guilds.cache.size;
  res.json({"servers" : serverCount});
  res.end();
});
export default function keepAlive():void{
  var site = http.createServer(server);
  site.listen(443, () => console.log("Sepbot is running on port :",443));
}