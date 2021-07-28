const fs = require("fs");
const words = JSON.parse(fs.readFileSync("./quiz/word.json", "utf8"));
function getLink(name=""){
    return "https://sepimage.netlify.app/image/"+name+".png";
}
function comma(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
class Quiz{
    rankimages = [getLink("newbie"),getLink("greenPurple"), getLink("game"), getLink("betterPlayer"), getLink("x"), getLink("Master"), getLink("Ranker"), getLink("hack")];
    ranknames = ["뉴비", "초보", "중수", "고수", "고인물", "마스터", "랭커","Ĥäčķ"];
    conditions=[0,100,500,3000,10000,25000,50000,100000,Infinity];
    error=["먼저 회원가입을 해주시길 바랍니다.", "이미 회원가입을 하신 것 같습니다.", "설정 값이 너무 큽니다", "설정 값이 너무 작습니다", "포인트가 충분하지 않습니다", "아직 퀴즈가 시작되지 않았습니다", "설정 값이 숫자가 맞는지 다시 확인해주세요"];
    constructor(connection){
        this.cnt = connection;
    }
    async getUser(userID){
      try{
        let result = {"isSign" : false, "user-object-0" : null};
        let userinfo = await this.cnt.list(userID);
        if(userinfo.length > 0){
          result["isSign"] = true;
          let userdata = await this.cnt.get(userID);
          userdata = JSON.parse(userdata);
          result["user-object-0"] = userdata;
          return result;
        }else{
          return result;
        }
      }catch(err){
        throw err;
      }
    }
    async getChannel(channelID){
      try{
        let result = {"isPlaying" : false, "word-index-0" : null};
        let isPlaying = await this.cnt.list(channelID);
        isPlaying = isPlaying.length>0?true:false;
        if(isPlaying == true){
            result["isPlaying"] = isPlaying;
            let wordinfo = await this.cnt.get(channelID);
            result["word-index-0"] = JSON.parse(wordinfo);
        }
        return result;
    }catch(err){
      throw err;
    }
    }
    async hint(channelID){
      try{
        let result = {"isPlaying" : false, "result" : null, "reason" : null};
        let channel = await this.getChannel(channelID);
        if(channel["isPlaying"] == true){
            result["isPlaying"] = true;
            result["result"] = words[channel["word-index-0"]["word"]]["hint"];
        }else{
            result["reason"] = this.error[5];
        }
        return result;
      }catch(err){ throw err }
    }
    async pass(channelID){
      try{
        let result = {"isPlaying" : false, "result" : null, "reason" : null};
        let channel = await this.getChannel(channelID);
        if(channel["isPlaying"] == true){
            result["isPlaying"] = true;
            let answer = words[channel["word-index-0"]["word"]]["answer"];
            this.cnt.delete(channelID);
            result["result"] = answer;
        }else{
            result["reason"] = this.error[5];
        }
        return result;
      }catch(err){ throw err }
    }
    async add(userID, key, num){
      try{
        let result = {"isSign" : false, "reason" : null, "result" : null};
        let user = await this.getUser(userID);
        if(user.isSign == true){
            result["isSign"] = true;
            user["user-object-0"][key] = Number(user["user-object-0"][key])+Number(num);
            console.log(user["user-object-0"][key]);
            this.cnt.set(userID, JSON.stringify(user["user-object-0"], null,2));
            result["result"] = user["user-object-0"];
        }else{
            result["reason"] = this.error[0];
        }
        return result;
      }catch(err){ throw err }
    }
    async isAnswer(channelID, answerMsg){
      try{
        let result = {"isPlaying" : false, "result" : {"bool" : false,"correct" : {"length" : 0, "percentage" : 0}}, "reason" : null};
        let channel = await this.getChannel(channelID);
        if(channel.isPlaying){
            result["isPlaying"] = true;
            let ans = words[channel["word-index-0"]["word"]]["answer"];
            if(ans == answerMsg){
                result["result"]["bool"] = true;
                result["result"]["correct"]["length"] = ans.length;
                result["result"]["correct"]["percentage"] = 100;
                this.cnt.delete(channelID);
            }else if(answerMsg.length == ans.length){
                let correct = 0
                for(var i = 0;i < ans.length;i++){
                    if(answerMsg[i] == ans[i]){
                        correct+=1;
                    }
                }
                result["result"]["correct"]["percentage"] = ((correct / ans.length) * 100).toFixed(3); 
                result["result"]["correct"]["length"] = correct;
            }else{
                if(answerMsg.length > ans.length){
                    result["reason"] = this.error[2];
                }else{
                    result["reason"] = this.error[3];
                }
            }
        }else{
            result["reason"] = this.error[5];
        }
        return result;
    }catch(err){ throw err }
    }
      async setWord(channelID){
      try{
        let result = {"setWord" : false, "getWord" : false, "result" : null};
        let isPlaying = await this.getChannel(channelID);
        if(isPlaying["isPlaying"] == true){
            result["getWord"] = true;
            result["result"] = words[isPlaying["word-index-0"]["word"]];
        }else{
            let random = Math.floor(Math.random() * words.length);
            let setData = {
              type: "CHANNEL",
              id: channelID,
              word: random
            }
            this.cnt.set(channelID, JSON.stringify(setData,null,2));
            result["result"] = words[random];
            result["setWord"] = true;
        }
        return result;
      }catch(err){ throw err }
    }
    async getRank(userID){
      try{
        let result = {"isSign" : false, "result" : {"rank" : null, "index" : null}, "reason" : null};
        let player = await this.getUser(userID);
        if(player["isSign"] == true){
            result["isSign"] = true;
            let keys = await this.cnt.list();
            let users = [];
            for(var i=0;i<keys.length;i++){
              let userData = await this.cnt.get(keys[i]);
              userData=JSON.parse(userData);
              if(userData["type"]=="USER"){
                users.push(userData);
              }else{
                continue;
              }
            }
            users.sort((a,b) => b.point - a.point);
            let userRank = users.findIndex(e => e.id === userID);
            let ranks = [
                users[0],users[1],users[2], users[3], users[4]
            ];
            result["result"]["rank"] = ranks;
            result["result"]["index"] = userRank;
        }else{
            result["reason"]= this.error[0];
        }
        return result;
      }catch(err){ throw err }
    }
      async signUp(userID, username){
      try{
        let result = {"reason" : this.error[1], "isSign" : true};
        let user = await this.getUser(userID);
        let isSign = user["isSign"];
        if(isSign == false){
            result.isSign = false;
            let signData = {
              type: "USER",
              id: userID,
              name: username,
              point: 0,
              rankimage: this.rankimages[0],
              rankname: this.ranknames[0]
            }
            this.cnt.set(userID, JSON.stringify(signData,null,2));
            result["reason"] = null;
        }
        return result;
      }catch(err){ throw err }
    }
    async reloadRank(userID){
      try{
        let user = await this.getUser(userID)
        for(var i = 0;i < this.conditions.length;i++){
            if(user["user-object-0"].point > this.conditions[i]){
                user["user-object-0"].rankimage = this.rankimages[i];
                user["user-object-0"].rankname = this.ranknames[i];
            }
        }
        this.cnt.set(userID, JSON.stringify(user["user-object-0"],null,2));
        return;
      }catch(err){ throw err }
    }
    async setRank(userID, index=0){
      try{
        let result = {"reason" : null, "result" : null, "isSign" : false, "bool" : false};
        let user = await this.getUser(userID);
        if(user.isSign == true){
            result["isSign"] = true;
            if(isNaN(index)){
              result["reason"] = this.error[6];
            }else{
              if(index > this.conditions.length){
                result["reason"] = this.error[2];
              }else if(index < 0){
                result["reason"] = this.error[3];
              }else{
            if(user["user-object-0"]["point"] >= this.conditions[index]){
                result["result"] = {
                    image : this.rankimages[index],
                    name : this.ranknames[index]
                };
                user["user-object-0"]["rankname"] = this.ranknames[index];
                user["user-object-0"]["rankimage"] = this.rankimages[index];
                this.cnt.set(userID,JSON.stringify(user["user-object-0"],null,2));
                result["bool"] = true;
            }else{
                result["reason"] = this.error[4];
            }
              }
            }
        }else{
            result['reason'] = this.error[0];
        }
        return result;
      }catch(err){ throw err }
    }
    async setName(userID, name){
      try{
        let result = {"isSign" : false, "change" : false};
        let user = await this.getUser(userID);
        if(user.isSign == true){
            result.isSign = true;
            name = name.length>20?name.substring(0,20)+"...":name;
            user["user-object-0"]["name"] = name;
            this.cnt.set(userID, JSON.stringify(user["user-object-0"]));
            result.change = true;
        }else{
        }
        return result;
      }catch(err){ throw err }
    }
}




module.exports = Quiz;