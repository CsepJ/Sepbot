let { prefix } = require("../config");
let cmd = [{
    name : prefix+"퀴즈", value : "퀴즈 명령어 목록을 전송합니다!", inline:false
},
{
    name : prefix+"가입", value : "회원가입을 해보세요!", inline : true
},
{
    name : prefix+"초성", value : "초성퀴즈를 시작합니다!", inline :false
},
{
    name : prefix+"정보", value : "자신의 정보를 전송합니다!", inline : false
},
{
    name : prefix+"힌트", value : "초성퀴즈의 힌트를 전송합니다!", inline : true
},
{
    name : prefix+"패스", value : "초성퀴즈를 패스합니다!", inline : false
},
{
    name : prefix+"랭크", value : "셉봇퀴즈 순위 랭킹을 전송합니다!", inline : true
},
{
    name : prefix+"이름 (바꿀이름)", value : "자신의 이름을 바꿉니다!", inline: false
},
{
    name : prefix+"칭호", value : "모든 칭호를 전송합니다! (DM으로 전송)", inline : true
},
{
    name : prefix+"설정", value : "자신의 칭호를 설정합니다!", inline : false
}];

module.exports = cmd;