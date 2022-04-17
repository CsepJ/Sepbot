import fs from "fs";
let powNumber = ["⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹"];
export function dateFormat(cdate:Date):string{
    let month = (cdate.getMonth()+1)>=10?cdate.getMonth().toString():"0"+(cdate.getMonth()+1);
    let year = cdate.getFullYear();
    let date = cdate.getDate()>=10?cdate.getDate().toString():"0"+cdate.getDate();
    let hours = (cdate.getHours()>12?cdate.getHours()-12:cdate.getHours().toString());
    let minuate = cdate.getMinutes();
    let isAmPm = hours > 12?"PM":"AM";
    let result = year+"/"+month+"/"+date+"/("+isAmPm+")"+hours+":"+minuate;
    return result;
}
export function filter(sentence:string):string{
    let words:Array<string> = JSON.parse(fs.readFileSync("../data/banWord.json", "utf8"));
	if(words.some(v => sentence.includes(v))){
		for(let i=0;i<words.length;i++){
			let regexp = new RegExp(words[i],"gi");
			console.log(regexp);
			sentence = sentence.replace(regexp,"*".repeat(words[i].length));
		}
	}
	return sentence;
}
export function comma(x:number | bigint):string{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export function primeFactors(n):string{
    let result = [];
    while (n%2 == 0) {
        if(result.some(v=>v.num==2)){
            result.find(v=>v.num==2).count += 1;
        }else{
            result.push({num: 2, count: 1});
        }
        n /= 2;
    }
    for (var i=3;i*i <= n;i=i+2) {
        while (n%i==0) {
            if(result.some(v=>v.num==i)){
                result.find(v=>v.num==i).count += 1;
            }else{
                result.push({num: i, count: 1});
            }
            n /= i;
        }
    }
    if (n>2) {
        if(result.some(v=>v.num==n)){
            result.find(v=>v.num==n).count += 1;
        }else{
            result.push({num: n, count: 1});
        }
    }
    return multiplyFormat(result);
}
export function multiplyFormat(multiplication:Array<{num: number, count: number}>):string{
    let result=[];
    for(let primeFactor of multiplication){
        let exponent = primeFactor.count==1?"":(primeFactor.count.toString()).split("").map(e => powNumber[parseInt(e)]).join("");
        result.push(primeFactor.num.toString()+exponent);
    }
    return result.join(" × ");
}