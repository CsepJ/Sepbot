var words = ["지랄","애미","애비","에미","창년","에비","씨발","시발","개새","개새끼","샊이","개새기","개샊이","^^ㅣ발","씹알","씨벌","씨불","씨부레","시벌","병신","븅신","퓽신","샊2","벙신","놈","좆","졷","느금마","늑음마","느금아","쉑끼","늑음아","늑으마","느그마","니엄마","네엄마","자위","딸치기","딸쳐라","딸딸이","세끼","섀끼","셰끼","섻으","섻스","색스","섹스","성관계"]
function filter(sentence){
	var result = "";
	var find = words.filter(e => sentence.includes(e));
			if(find == undefined){
				result = sentence;
			}else{
				for(var i = 0;i < find.length; i++){
					var filt = "*".repeat(find[i].length);
					sentence = sentence.replace(find[i],filt);
			}
			result = sentence;
		}
		return result;
		}
		module.exports = {
			"filt" : filter
		}