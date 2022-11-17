import { ApplicationCommandData } from "discord.js"

let command:Array<ApplicationCommandData> = [
    {
          "name": "셉봇",
          "description" : "셉봇을 호출합니다!"
      },
      {
        "name": "명령어",
        "description": "셉봇이 사용방법을 알려드립니다"
      },
      {
        "name": "초대",
        "description": "셉봇의 초대 버튼을 보내줍니다."
      },
      {
        "name": "서버",
        "description": "현재 서버의 정보를 알려드립니다"
      },
      {
        "name": "업데이트",
        "description": "셉봇이 업데이트 소식을 알려드립니다"
      },
      {
        "name" : "차트",
        "description" : "멜론 차트를 가져옵니다."
      },
      {
        "name": "개발자",
        "description": "셉봇 개발자의 정보입니다"
      },
      {
          "name": "코로나",
          "description" : "현재 코로나 현황을 가져옵니다."
        },
        {
          "name" : "단어",
          "description": "입력하신 단어를 사전에서 찾습니다.",
          "options": [
            {
              "name": "단어",
              "description": "검색할 단어를 입력해주세요",
              "type" : "STRING",
              "required" : true
          }
        ]
      },
      {
          "name" : "소인수분해",
          "description" : "입력하신 숫자를 소인수분해합니다.",
          "options": [
            {
              "name": "숫자",
              "description": "소인수분해 할 숫자를 입력해주세요",
              "type" : "INTEGER",
              "required": true
            }
          ]
      },
      {
        "name": "한국어",
        "description": "한국어 => 영어로 번역합니다",
        "options": [
          {
            "name": "한국어",
            "description": "영어로 번역할 단어를 입력해주세요",
            "type": "STRING",
            "required": true
          }
        ]
      },
      {
        "name": "영어",
        "description": "영어 => 한국어로 번역합니다",
        "options": [
          {
            "name": "영어",
            "description": "한국어로 번역할 단어를 입력해주세요",
            "type": "STRING",
            "required": true
          }
        ]
      },
      {
        "name" : "메세지",
        "description" : "메세지를 이모티콘처럼 나타내줍니다",
        "options" : [
          {
            "name": "영문메세지",
            "description" : "나타낼 메세지를 입력해주세요",
            "type" : "STRING",
            "required" : true
          }
        ]
      },
      {
        "name" : "인코드",
        "description" : "유니코드로 변환합니다.",
        "options" : [
          {
            "type" : "SUB_COMMAND",
            "name" : "유니코드",
            "description" : "유니코드 관련 명령어"
          },
          {
            "name" : "문자",
            "description" : "유니코드로 변환할 문자를 입력해주세요",
            "type" : "STRING",
            "required" : true
          }
        ]
      },
      {
        "name" : "디코드",
        "description" : "유니코드에서 변환합니다.",
        "options" : [
          {
            "type" : "SUB_COMMAND",
            "name" : "유니코드",
            "description" : "유니코드 관련 명령어"
          },
          {
            "name" : "유니코드",
            "description" : "문자로 변환할 유니코드를 입력해주세요",
            "type" : "STRING",
            "required" : true
          }
        ]
      }
    ];
    export default command