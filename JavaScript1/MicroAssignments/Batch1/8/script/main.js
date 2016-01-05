
function calculate () {
	var a = 0, b= 0, result = 0;
	a = document.getElementById("number1").value;
	b = document.getElementById("number2").value;
	if((isNaN(a))||(isNaN(b)))
	{
		document.getElementById("result").value = "";
	}
	else
	{
		a = parseFloat(a);
		b = parseFloat(b);
		var drop = document.getElementById("drop");
		var operator = drop.options[drop.selectedIndex].value;
		if(!(isNaN(a)) && !(isNaN(b)))
		switch (operator) 
		{
			case "1":
			document.getElementById("result").value = a + b;
			break;
			case "2":
			document.getElementById("result").value = a - b;
			break;
			case "3":
			document.getElementById("result").value = a * b;
			break;
			case "4":
			document.getElementById("result").value = a / b;
			break;
			default:
			document.getElementById("result").value = "";
		}
    }
}

var start = document.getElementById("myForm");
start.addEventListener("input", calculate, false);
start.addEventListener("select", calculate, false);
var a = document.getElementById("number1");
a.addEventListener("click", function(){
	a.value = "";
},false);
var b = document.getElementById("number2");
b.addEventListener("click", function(){
	b.value = "";
},false);