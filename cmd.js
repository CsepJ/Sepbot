const config = require("./config.js");
module.exports = [
    {
      cmd : `${config.prefix}명령어`, description : `셉봇이 사용방법을 알려드립니다`
    },{
      cmd : `${config.prefix}퀴즈`, description : `셉봇이 퀴즈게임 명령어를 알려드립니다`
    },{
      cmd : `${config.prefix}정보`, description : `서버의 정보를 알려드립니다`
    },{
      cmd: `${config.prefix}한국어 [단어]`, description : `셉봇이 한국어를 영어로 번역해드립니다`
    },{
      cmd: `${config.prefix}영어 [단어]`, description : `셉봇이 영어를 한국어로 번역해드립니다`
    },{
      cmd : `${config.prefix}내역`, description : `셉봇이 업데이트 소식을 알려드립니다`
    }
  ]