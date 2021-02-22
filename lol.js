 
var cheerio = require('cheerio');
var request = require('request');
function lol(nickname) {
var rank;
var winodds;
var level;
var profile;
var lolname;
var url = 'https://www.op.gg/summoner/userName='+nickname;
return new Promise(resolve=>{
request(url, function(error, response, html){
  if (!error) {
    var $ = cheerio.load(html);
    $('body > div.l-wrap.l-wrap--summoner > div.l-container > div > div > div.Header > div.Face > div > img').each(function(){
        var image = $(this);
        var profile1 = "https:"+image.attr("src");
        profile = profile1;
    });
$("body > div.l-wrap.l-wrap--summoner > div.l-container > div > div > div.Header > div.Profile > div.Information > span").each(function() {
    var name = $(this);
    var lolname1 = name.text();
    lolname = lolname1;
});
$("#GameAverageStatsBox-summary > div.Box > table > tbody > tr:nth-child(2) > td.Summary > div > div.Text").each(function() {
    var odds = $(this);
    var winodds1 = odds.text();
    winodds = winodds1;
}); 
$("body > div.l-wrap.l-wrap--summoner > div.l-container > div > div > div.Header > div.Face > div > span").each(function() {
    var level1 = $(this).text();
    level = level1;
});
$('#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.SideContent > div.TierBox.Box > div > div.TierRankInfo > div.TierRank').each(function() {
    var rank1 = $(this).text().replace(/\n/g,"").replace(/	/g,"");
    rank = rank1;
});
let result = JSON.stringify({
    "profile" : profile,
    "winodds" : winodds,
    "level" : level,
    "lolname" : lolname,
    "rank" : rank
});
resolve(result);
}
//error
});
//request
});
}
//function

module.exports.lolstat = lol; 