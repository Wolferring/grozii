// import FastClick from 'fastclick'
// if ('addEventListener' in document) {
//     document.addEventListener('DOMContentLoaded', function() {
//         FastClick.attach(document.body);
//     }, false);
// }
((doc, win) => {
	const docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = () => {
			let clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			let fontSize = 160/5 * (clientWidth / 320)
			docEl.style.fontSize = clientWidth>1200?"120":fontSize + 'px';
		};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
	//当dom加载完成时，或者 屏幕垂直、水平方向有改变进行html的根元素计算
})(document, window);