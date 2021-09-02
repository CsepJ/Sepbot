const replit = require("@replit/database");
const db = new replit();
async function save(){
	let result = [];
	let keys = await db.list();
	for(let i=0;i<keys.length;i++){
		let user = await db.get(keys[i]);
		result.push(JSON.parse(user));
	}
	return result;
}
module.exports = save;