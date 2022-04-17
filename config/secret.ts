import dotenv from "dotenv";
import update from "../data/update";
dotenv.config({
    path: "./config/.env"
});
export default {
    "version" : update[0].version,
    "token" : process.env.token,
    "prefix" : "/",
    "naverId" : process.env.naverid,
    "naverPw" : process.env.naverpw,
    "koreanbotsKey": process.env.koreanbotskey,
    "covidKey": process.env.covidkey
};