var red = 0 ;
var green = 0 ;
var blue = 0 ;

function setColor1 () {
	var color = rgb2hex(red, green, blue);
	console.log(red);
	console.log(green);
	console.log(blue);
	console.log(color);
	document.body.style.backgroundColor = color;
}
function setColor2 () {
	var color = rgb2hex(red, green, blue);
	console.log(red);
	console.log(green);
	console.log(blue);
	console.log(color);
	document.body.style.backgroundColor = color;
}
function setColor3 () {
	var color = rgb2hex(red, green, blue);
	console.log(red);
	console.log(green);
	console.log(blue);
	console.log(color);
	document.body.style.backgroundColor = color;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgb2hex(red, green, blue)
{
    return '#' + componentToHex(red) + componentToHex(green) + componentToHex(blue);
}


var state1 = document.getElementById("slide-r");
state1.addEventListener("input", function (){
	red=parseInt(document.getElementById("slide-r").value,10);
	setColor1();
},false); 

var state2 = document.getElementById("slide-g");
state2.addEventListener("input", function (){
	green=parseInt(document.getElementById("slide-g").value,10);
	setColor2();
},false);

var state3 = document.getElementById("slide-b");
state3.addEventListener("input", function (){
	blue=parseInt(document.getElementById("slide-b").value,10);
	setColor3();
},false);

