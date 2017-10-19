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
                let currentWeb = plus.webview.getDisplayWebview()[0].id
                switch(currentWeb){
                	case "create":
	                    plus.webview.close("create","slide-out-right")
	                    return false;                	
                		break;
                	case "browser":
	                    plus.webview.close("browser","slide-out-right")
	                    return false;
	                	break;
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