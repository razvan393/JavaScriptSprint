

function verificare() {
var nume = document.getElementById("name").value;
nume = nume.trim();
var vector = nume.split(" ");
console.log(vector.length);
if (vector.length === 2)
{
	if((vector[0].length >=3) && (vector[1].length >=3))
	{
		document.getElementById("container").classList.add("valid");
	}
	else
	{
		document.getElementById("container").class
	}
}
else 
{
	document.getElementById("container").className = "";
}

}

var start = document.getElementById("name");
start.addEventListener("input", verificare, false);