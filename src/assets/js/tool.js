import Vue from "vue";
Date.prototype.format = function(fmt) {
     var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}
var tool = {
	convertDate(time){
		const d = new Date(time)
		return d.format('yyyy-MM-dd').replace(/\//g,"-")
	},
    openUrl(url,title){
        // let webview = plus.webview.create(url,{
        //     'titleNView':{
        //         'backgroundColor':'#fff',
        //         'titleText':'标题栏文字',
        //         'titleColor':'#333',
        //         autoBackButton:true
        //     }
        // });
        // webview.show("slide-in-right")
        plus.runtime.openURL(url)
    },
    openWebview(url,title){
        let webview = plus.webview.create(url,"browser",{
            'titleNView':{
                'backgroundColor':'#fff',
                'titleText':title,
                'titleColor':'#333',
                "titleSize":"15px",
                "splitLine":{
                    "color":"#e0e0e0"
                },
                "progress":{color:'#23deb1'},
                'buttons':[{
                    color:"#23deb1",
                    float:"left",
                    text:"关闭",
                    fontSize:"15px",
                    onclick:function(){
                        var view = plus.webview.getWebviewById("browser")
                        plus.webview.close(view,"slide-out-right")
                    }
                }]
            }
        });
        webview.show("slide-in-right")
    },
    throttle(func, wait) {
        var context, args, timeout, result;
        var previous = 0;
        var later = function() {
          previous = new Date;
          timeout = null;
          result = func.apply(context, args);
        };
        return function() {
          var now = new Date;
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
          } else if (!timeout) {
            timeout = setTimeout(later, remaining);
          }
          return result;
        };
    },
}
Vue.filter('convertNumber', function (value) {
	const digg = String(value);
	switch(digg.length){
		case 4:
			return digg.slice(0,1)+"."+digg.slice(1,2)+"k"
			break;
		case 5:
			return digg.slice(0,2)+"."+digg.slice(2,3)+"k"
			break;
		default:
			return digg
	}
})
export default {tool}
