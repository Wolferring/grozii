var htmlPlus = {
	init:function(self){
		if(window.plus){
		    plusReady();
		}else{ 
		    document.addEventListener( "plusready", plusReady, false );
		}
		// 扩展API准备完成后要执行的操作
		function plusReady(){
			plus.key.addEventListener("backbutton",function(){
                let browser = plus.webview.getWebviewById("browser")

				if(browser){
                    plus.webview.close(browser,"slide-out-right")
                    return false;
				}
				self.$router.back();
			},false)

		} 
	},
	bind(fn){
		if(window.plus){
		    fn()
		}else{ 
		    document.addEventListener( "plusready", fn, false );
		}		
	}
}
export default htmlPlus