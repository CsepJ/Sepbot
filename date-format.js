function date(cdate=new Date()){
let month = (cdate.getMonth()+1);
let year = cdate.getFullYear();
let date = cdate.getDate();
let hours = cdate.getHours();
let minuate = cdate.getMinutes();
let isAmPm = hours > 12?"PM":"AM";
hours = hours>12?hours-12:hours;
month = month >= 10?month:"0"+month;
date = date >= 10?date:"0"+date;
let result = year+"/"+month+"/"+date+"/("+isAmPm+")"+hours+":"+minuate;
return result;
}
module.exports = {
    date
}