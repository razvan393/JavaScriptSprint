var k = 0;

function verificare() {
var nume = document.getElementById("name").value;
var vector = nume.split(" ");
if (vector.length === 2) 
{
	if((vector[0].length >=3) && (vector[1].length >=3))
	{
		k = 1;
	}
	else
	{
		k = 0;
	}
}
else 
{
	k = 0;
}

if(k === 1)
{
	document.getElementById("container").className = "valid";
}
else
{
	document.getElementById("container").className = "";

}

}

var start = document.getElementById("name");
start.addEventListener("input", verificare, false);