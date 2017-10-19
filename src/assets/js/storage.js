import htmlPlus from '../../config/plusInit.js'
var local = window.localStorage,
	phone;
htmlPlus.bind(function(event) {
	phone = plus.storage
});
var storage = {
	getAllStorage(){
		return local;
	},
	get(name){
		//console.log("获取离线数据 "+name+" [storage.js]")
		let result = local.getItem(name);
		try{
			result = JSON.parse(result)
		}catch(e){

		}
		return result
	},
	set(name,value){
		//console.log("保存 "+name+"|"+value+" [storage.js]")
		try{
			local.setItem(name,value)
		}
		catch(oException){
			if(oException.name == "QuotaExceededError"){
				console.warn("本地存储超限，将尝试使用本机存储")
			}
		}
	}
}
export default storage
