export default [
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
            "type" : 3,
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
                  "type" : 4,
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
            "type": 3,
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
            "type": 3,
            "required": true
          }
        ]
      }
]