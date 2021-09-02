require("dotenv").config();
let config = require("./config.js");

module.exports = {
	"version" : config.version,
	"log" : "Axios패키지 사용"
}