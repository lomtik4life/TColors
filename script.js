  ////////////////////  ctx - drawing color
  // Initial Canvas //  xtc - screenshot (DOM hide)
  ////////////////////
var imgS = new Image();
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var topColor = [];
var clr = document.getElementById('clr');
var idList = ['clr-one', 'clr-two', 'clr-three', 'clr-four', 'clr-five']; // all id cart
var HistoryArrNamesLi = ['history-one', 'history-two', 'history-three', 'history-four', 'history-five']; // history li
var idNumber = -1;
var ds = new Date();
var number = localStorage.getItem('number') ? localStorage.getItem('number') : 5;
var TimeHistory = localStorage.getItem('time') ? localStorage.getItem('time') : 60000;
var arrNames = localStorage.getItem('names') ? localStorage.getItem('names').split(',') : [];
var step = 3; //
var differenceColor = 60;

document.getElementById('historySecondNumber').value = TimeHistory / 60000;
document.getElementById('setCardsNumber').value = number;

document.getElementById('btn-start').onclick = function () {
    document.getElementById('load').style.display = 'block';
	takeImage();
};
document.getElementById('historyClean').onclick = function () {
    historyClean();
};
document.getElementById('historySecond').onclick = function () {
    setHS();
};
document.getElementById('setCards').onclick = function () {
    setCN();
};
document.getElementById('btn-about').onclick = function () {
    about('show');
};
document.getElementById('about').onclick = function () {
    about();
};
document.getElementById('history').onclick = function (e) {
    for (var i = 0; i < 5; i++) {
        if (HistoryArrNamesLi[i] === e.path[1].id) break;
    };
    placeRight();
    document.getElementById('btn-x').style.display = 'none';
    document.getElementById('btn-setting').style.display = 'block';
    document.getElementById('btn-history').style.display = 'block';
    drawCart(localStorage.getItem(localStorage.getItem('names').split(',')[i]).split(';'));
};
// Click to color and clickToCopy()
clr.onclick = function (e) {
	var className = e.path[1].className;
	if (className === 'rgb') {
		clickToCopy('rgb');
	} else if (className === 'hex') {
		clickToCopy('hex');
	};
};

clr.onmouseover = function (e) {
	var idThisCart = e.target.id;
	if (e.fromElement.nodeName !== 'LI') {
		zoomColorCart(idThisCart);
	};
};

document.getElementById('btn-setting').onclick = function () {
    placeRight();   
    settingShow();    
};

document.getElementById('btn-history').onclick = function () {
    placeRight();    
    historyShow();    
};
document.getElementById('btn-x').onclick = function() {
    placeRight();
    document.getElementById('btn-x').style.display = 'none';
    document.getElementById('btn-setting').style.display = 'block';
    document.getElementById('btn-history').style.display = 'block';
};


lStorage('get');


  /////////////
  // Initial //
  /////////////
imgS.onload = function () {
	menageImage();
};

   //////////////////////  
   // Screenshot Image //  return img
   //////////////////////
function takeImage() {
	chrome.tabs.captureVisibleTab(
		null,
		{},
		function(dataUrl) {
			imgS.src = dataUrl;
			ctx.drawImage(imgS,0,0);
		}
	)
};

  //////////////////  img to let arrayColor
  // img To array //  return colorTop
  //////////////////  attr : (numberTopElment)

function menageImage() {
    var testTime = new Date() ;
	var arrayColorSrc = [];
	var arrayColor = {};        // All array color {['color'],...}
	var arrayColorTop = {};     // Mirror arrayColor {'numberDef':'color',...}
	var arrayColorTopKeys = []; // Keys arrayColorTop {['numberDef'],...}
	//var arrayCM = {}
	var aH = imgS.height; // Height img
	var aW = imgS.width;  // Width  img
	var len = 0;
	//var lenR = 0;
	topColor = [];
	// Create array color (0,0,0,0) in arrayColorSrc
	for (var i = 0; i < aH; i += step) {
		for (var n = 0; n < aW; n += step) {
			var pixel = ctx.getImageData(n,i,1,1);
			var temp = [pixel.data[0], pixel.data[1], pixel.data[2]];
			arrayColorSrc.push(temp);
			len++;
		};
	};

	// for arrayColor object 
	for (var i = 0; i < len; i++) {
		if (arrayColorSrc[i] in arrayColor) {
			arrayColor[arrayColorSrc[i]]++;
		} else {
			arrayColor[arrayColorSrc[i]] = 1;
		};
	};
	// For arrayColorMirror
	for (i in arrayColor) {
		arrayColorTop[arrayColor[i]] = i;
		arrayColorTopKeys.push(arrayColor[i]);
	};
	// Function  Sort
	function sIncrease(i, ii) { // По возрастанию
		if (i > ii) return 1;
 		else if (i < ii) return -1;
 		else return 0;
	};
	arrayColorTopKeys.sort(sIncrease).reverse();
	function see(arr,clr) {
		var sc = clr.split(',');
		var len = Object.keys(arr).length;
		var ii = 0;
		for (var i = 0; i < len; i++) {
			var zam = 0;
			var sa = arr[i].split(',');
			for (var z = 0; z < 3; z++) {
				var temp = parseInt(sa[z]) - parseInt(sc[z]);
				if (Math.abs(temp) < differenceColor) zam++;
				if (zam === 2) return false;
			};
		};
		return true;
	};
	//
	function diffirentColor() {
		var colorReturn = [];
		var i = 0, n = 0;
		while (number !== n) {
			var cT = arrayColorTop[arrayColorTopKeys[i]] ;// = [str,str,str]
            if (!arrayColorTop[arrayColorTopKeys[i]]) break;
			if (!i) {
				colorReturn.push(cT);
				i++;
				n++;
			} else if (see(colorReturn,cT)) {
				colorReturn.push(cT);
				i++;
				n++;
			} else {
				i++;
			};
		};
        if (differenceColor < 5) return colorReturn;
        if (colorReturn.length < number) {
            differenceColor = differenceColor / 2;
            return diffirentColor();
        } else {
            return colorReturn;
        };
	};
	draw = diffirentColor();
    if (draw.length < number) number = draw.length;
    drawCart(draw);
    lStorage('set',draw);
};

	//////////////////////////////////
	// Mouse over cart. Cart zoomx2 //
	//////////////////////////////////
function zoomColorCart(id){
	var elemA = 5, elemB = 5; // eleent zoomx0.5, left, right.
	for (var i = 0; i < idList.length; i++) { // number id in idList
		if (idList[i] === id) {
			idNumber = i;
			var elem = document.getElementById(id); // hiver Cart is DOM
			if (idNumber !== 0) elemB = document.getElementById(idList[idNumber-1]); //  Left of hover cart
			if (idNumber !== 4) elemA = document.getElementById(idList[idNumber+1]); //  Right of hover cart

			// resize elements
			elem.style.width = '78px'; // widthx2
			if (idNumber !== 0) elemB.style.width = '33px'; // Left element widthx0.5
			if (idNumber !== 0) clr.style.left = '25px';     // Left size is not element number 0
			if (idNumber === 0) clr.style.left = '10px';     // Hover element number 0, left ul is 10px moving
			if (idNumber !== 4) elemA.style.width = '33px'; // right element widthx0.5
			// All elment width normal, not hover
			for (var i = 0; i < idList.length; i++) {  
				var eN = document.getElementById(idList[i]);
				if (eN === elem) continue;
				if (eN === elemA || eN === elemB) continue;
				eN.style.width = '48px';
			};
			rbgHex(elem);
        };
	};
};

	////////////////////////////////////////////////////////////
	// Color cart magical transformation and fill rgb and hex //
	////////////////////////////////////////////////////////////
function drawCart(arrayColor) {
    document.getElementById('load').style.display = 'none';
	var element = document.getElementById('clr').getElementsByTagName('LI');
	for (var i = 0; i < number; i++) {
        if (!arrayColor[i]) break;
		element[i].style.display = 'inline-block';
		element[i].style.backgroundColor = 'rgb('+arrayColor[i]+')';
	};
};
// Magick RBG color to HEX !
function rgbToHex(rgbClr) {
	rgbClr = rgbClr.split(',');
		function componentToHex(c) {
		    var hex = c.toString(16);
		    return hex.length == 1 ? "0" + hex : hex;
		};
    return "#" + componentToHex(parseInt(rgbClr[0])) + componentToHex(parseInt(rgbClr[1])) + componentToHex(parseInt(rgbClr[2]));
};
// Cart write rgb and hex color
function rbgHex(dom) {
	var color = dom.style.backgroundColor;
	for (var i = 0; i < number; i++) {
		document.getElementsByClassName('rgb')[i].style.display = 'none';
		document.getElementsByClassName('hex')[i].style.display = 'none';
	};
	dom.getElementsByClassName('rgb')['0'].style.display = 'block';
	dom.getElementsByClassName('hex')['0'].style.display = 'block';
	dom.getElementsByClassName('rgb')['0'].getElementsByClassName('clr-rgb-value')[0].innerHTML = color.slice(4,-1);
	dom.getElementsByClassName('hex')['0'].getElementsByClassName('clr-hex-value')[0].innerHTML = rgbToHex(color.slice(4,-1));
};

	//////////////////////////////
	//  Local storage Function  //
	//////////////////////////////
function lStorage(action, arrClr) {
	function arrToString(arr) {
		var s = '';
		for (var i = 0; i < arr.length; i++) {
			s += arr[i]+';';
		};
		return s;
	};
	function stringToArray(str) {
		var a = [];
		str = str.split(';');
		for (var i = 0; i < str.length; i++) {
			if (!str[i]) return a;
			a.push(str[i].split(','));
		};
		return a;
	};

	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    	tabUrl = tabs[0].url;
    	if (action === 'get' && ds.getTime() - localStorage.getItem(tabUrl+'time') < TimeHistory) {
            var timeago = (ds.getTime() - localStorage.getItem(tabUrl+'time')) / 60000;
    		document.getElementById('time').innerHTML = 'Load result ' + timeago.toFixed(0) + ' min. ago.';
	        drawCart(stringToArray(localStorage.getItem(tabUrl)).slice(0,number));                 // Gracia!!! Return array the city color in array Local
	    };

    	if (localStorage.getItem('names')) {
			var arrNames = localStorage.getItem('names').split(','); // arr [name1, name2,...]
	    } else {
	    	var arrNames = [];
	    };
	    var objNames = {};                                       // obj names = [color1, color2,...]
	    for (var i = 0; i < arrNames.length; i++) {
	    	var t = arrNames[i];
	    	if (localStorage.getItem(arrNames[i])) {
	    		var z = localStorage.getItem(arrNames[i]).split(',');
	    	} else {
	    		var z = [',,'];
	    	};
	        objNames.t = z;
	    };
	    if (action === 'set') {                           		 // get
	    	arrClr = arrToString(arrClr);
	    	if (!arrNames.length) saveSiteInLocalStorage(); // ZERO
			for (var i = 0, s = 1; i < arrNames.length; i++) {
				if (tabUrl === arrNames[i]) s--;
			};
			if (s) saveSiteInLocalStorage();
			function saveSiteInLocalStorage() {
	        	if (arrNames.length >= 20) {                         // full memory? >20
		            localStorage.removeItem(arrNames[0]);
		            localStorage.removeItem(arrNames[0]+'time');
		            arrNames.shift();
		        };
		        arrNames.push(tabUrl);
	        };
	        localStorage.setItem('names', arrNames);
	        localStorage.setItem(tabUrl,arrClr);
	        localStorage.setItem(tabUrl+'time',ds.getTime());
	        document.getElementById('time').innerHTML = '';
	        return true;
	    };
	});
};
	/////////////////////////// attr : 'rgb' | 'hex' 
	//  Click to COPY color  //
	///////////////////////////

function clickToCopy(nameColor) {
	if (nameColor === 'rgb') {
		var divElem = document.getElementById(idList[idNumber]).getElementsByClassName('clr-rgb-value')[0];
		var prevElem = divElem.innerHTML;
		divElem.innerHTML = 'rgb('+divElem.innerHTML+')';
	} else if (nameColor === 'hex') {
		var divElem = document.getElementById(idList[idNumber]).getElementsByClassName('clr-hex-value')[0];
		var prevElem = divElem.innerHTML;
	};
	var range = document.createRange();  
  	range.selectNode(divElem);  
  	window.getSelection().addRange(range); 
	document.execCommand('copy', true);
	window.getSelection().removeAllRanges();
	divElem.innerHTML = '<p style="color: grey; font-weight: blod">copy</p>';
	setTimeout(function() {
		divElem.innerHTML = prevElem;
	}, 500);
};

function placeRight() {
    if (document.getElementById('btn-x').style.display = 'none') {
        document.getElementById('btn-x').style.display = 'block';
        document.getElementById('btn-setting').style.display = 'none';
        document.getElementById('btn-history').style.display = 'none';
    }
    document.getElementById('setting').style.display = 'none';
    document.getElementById('history').style.display = 'none';
	var pr = document.getElementById('place-right');
	if (pr.offsetWidth === 20) {
		pr.style.width = '300px';
		pr.style.left = '30px';
		pr.style.backgroundColor = '#B8B8B8';
	} else {
		pr.style.width = '20px';
		pr.style.left = '310px';
		pr.style.backgroundColor = '#DDDDDD';
	};
};

function settingShow() {
	var st = document.getElementById('setting');
	if (st.style.display === 'none' || !st.style.display) {
		st.style.display = 'block';
	} else {
		st.style.display = 'none';
	};
};

// cleaning stories
function historyClean() {
    var el = localStorage.getItem('names').split(',')
    for (var i = 0; i < el.length; i++) {
        localStorage.removeItem(el[i]);
        localStorage.removeItem(el[i]+'time');
    };
    localStorage.removeItem('names');
    for (var i = 0; i < 5; i++) {
        var hanl = document.getElementById(HistoryArrNamesLi[i]);
        hanl.getElementsByTagName('P')[0].innerHTML = '';
        for (var s = 0; s < 5; s++) {
            hanl.getElementsByTagName('LI')[s].style.background = '';
        };
    };
};

// secont time in history
function setHS() {
    if (document.getElementById('historySecondNumber').value < 61) {
        localStorage.setItem('time',document.getElementById('historySecondNumber').value*60000);
        TimeHistory = document.getElementById('historySecondNumber').value*60000;
    } else {
        document.getElementById('historySecondNumber').value = 60;
    };
};

// set carts number
function setCN() {
    if (document.getElementById('setCardsNumber').value > 0 && document.getElementById('setCardsNumber').value < 11) {
        localStorage.setItem('number',document.getElementById('setCardsNumber').value);
        number = document.getElementById('setCardsNumber').value;
    } else {
        document.getElementById('historySecondNumber').value = 5;
    };
};

// btn about
function about(action) {
    if (action) {
        document.getElementById('about').style.display = 'block';
        return;
    };
    document.getElementById('about').style.display = 'none';
};

function historyShow() {
	var hs = document.getElementById('history');
	if (hs.style.display === 'none') {
		document.getElementById('history').style.display = 'block';
        historyFill();
	} else {
		document.getElementById('history').style.display = 'none';
	};
};

function historyFill() {
    if (!localStorage.getItem('names')) {
        document.getElementById('history-one').getElementsByTagName('P')[0].innerHTML = 'No history';
    } else {
        document.getElementById('history-one').getElementsByTagName('P')[0].innerHTML = '';
    };
    var arrNames = localStorage.getItem('names').split(',');
    for (var i = 0; i < arrNames.length && i < 5; i++) {
        var hanl = document.getElementById(HistoryArrNamesLi[i]);
        var arrColor = localStorage.getItem(arrNames[i]).split(';');
        hanl.getElementsByTagName('P')[0].innerHTML = arrNames[i];
        for (var s = 0; s < (arrColor.length - 1) && s < number; s++) {
            hanl.getElementsByTagName('LI')[s].style.background = rgbToHex(arrColor[s]);
        };
    };
};
