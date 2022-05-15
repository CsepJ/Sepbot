import { SlashCommandBuilder } from "@discordjs/builders";

let commands = [
    new SlashCommandBuilder()
      .setName("셉봇")
      .setDescription("셉봇을 호출합니다."),
    new SlashCommandBuilder()
      .setName("명령어")
      .setDescription("셉봇이 사용방법을 알려드립니다."),
    new SlashCommandBuilder()
        .setName("초대")
        .setDescription("셉봇의 초대 버튼을 보내줍니다."),
    new SlashCommandBuilder()
        .setName("서버")
        .setDescription("현재 서버의 정보를 알려드립니다."),
    new SlashCommandBuilder()
        .setName("업데이트")
        .setDescription("셉봇이 업데이트 소식을 알려드립니다."),
    new SlashCommandBuilder()
        .setName("차트")
        .setDescription("멜론차트 순위를 가져옵니다."),
    new SlashCommandBuilder()
        .setName("개발자")
        .setDescription("셉봇의 개발자에 대한 정보입니다."),
    new SlashCommandBuilder()
        .setName("코로나")
        .setDescription("현재 코로나 현황을 가져옵니다."),
    new SlashCommandBuilder()
        .setName("단어")
        .setDescription("입력하신 단어를 사전에서 찾습니다.")
        .addStringOption(option => option.setName("단어").setDescription("검색할 단어를 입력해주세요.").setRequired(true)),
    new SlashCommandBuilder()
        .setName("소인수분해")
        .setDescription("입력하신 숫자를 소인수분해합니다.")
        .addIntegerOption(option => option.setName("숫자").setDescription("소인수분해할 숫자를 입력해주세요.").setRequired(true)),
    new SlashCommandBuilder()
        .setName("한국어")
        .setDescription("한국어를 영어로 번역합니다.")
        .addStringOption(option => option.setName("한국어").setDescription("영어로 번역할 단어를 입력해주세요.").setRequired(true)),
    new SlashCommandBuilder()
        .setName("영어")
        .setDescription("한국어로 번역할 단어를 입력해주세요.")
        .addStringOption(option => option.setName("영어").setDescription("한국어로 번역할 단어를 입력해주세요.").setRequired(true)),
    new SlashCommandBuilder()
        .setName("메세지")
        .setDescription("메세지를 이모티콘처럼 나타내줍니다.")
        .addStringOption(option => option.setName("영문메세지").setDescription("나타낼 메세지를 입력해주세요").setRequired(true)),
    new SlashCommandBuilder()
        .setName("유니코드")
        .setDescription("유니코드관련 명령어입니다.")
        .addSubcommand(subcmd => 
        subcmd.setName("인코드")
        .setDescription("유니코드로 변환합니다.")
        .addStringOption(option => option.setName("문자").setDescription("유니코드로 변환할 문자를 입력해주세요.").setRequired(true))).addSubcommand(subcmd => 
        subcmd.setName("디코드")
        .setDescription("유니코드에서 변환합니다.")
        .addStringOption(option => option.setName("유니코드").setDescription("문자로 변환할 유니코드를 입력해주세요.").setRequired(true)))
];
let cmd = [];
for(let i=0;i<commands.length;i++) {
    cmd[i] = commands[i].toJSON();
}
export default cmd;