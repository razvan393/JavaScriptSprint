
function calculate () {
	var a = 0, b= 0, result = 0;
	a = document.getElementById("number1").value;
	b = document.getElementById("number2").value;
	if((isNaN(a))||(isNaN(b)))
	{
		document.getElementById("result").value = NaN;
	}
	else
	{
		a = parseFloat(a);
		b = parseFloat(b);
		var drop = document.getElementById("drop");
		var operator = drop.options[drop.selectedIndex].value;
		console.log(operator);
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
			document.getElementById("result").value = NaN;
		}
    }
}

var start = document.getElementById("myForm");
start.addEventListener("input", calculate, false);
start.addEventListener("select", calculate, false);