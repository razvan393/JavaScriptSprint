var dk = 1, mk = 1, yk = 1;
var age ;
function addDays () 
{
    if (dk === 1)
    {
    	for (var i=1; i<=30; i++)
		{
		var option = document.createElement("option");
		option.value = option.textContent = i;
		day.appendChild(option);
		dk = 0;
		}
    }
}

function addMonths () 
{
    if (mk === 1)
    {
    	for (var i=1; i<=12; i++)
		{
		var option = document.createElement("option");
		option.value = option.textContent = i;
		month.appendChild(option);
		mk = 0;
		}
    }
}

function addYears () 
{
    if (yk === 1)
    {
    	for (var i=1960; i<=2010; i++)
		{
		var option = document.createElement("option");
		option.value = option.textContent = i;
		year.appendChild(option);
		yk = 0;
		}
    }
}

function calculateAge () {
	var d = parseInt(document.getElementById("day").value);
	var m = parseInt(document.getElementById("month").value);
	var y = parseInt(document.getElementById("year").value);
	if ((!isNaN(d))&&(!isNaN(m))&&(!isNaN(y))) 
	{
		var today = new Date();
		var sd = today.getDate();
		var sm = today.getMonth()+1;
		var sy = today.getFullYear();
		var sDate = (sy-1) * 365 + (sm-1) * 30 + sd;
		var uDate = (y-1) * 365 + (m-1) * 30 + d;
		age = Math.floor((sDate - uDate)/365);
		
		if(age < 18)
		{
			document.body.classList.add("disney");
		}
		else
		{
			document.body.classList.add("moose");
		}
	}
}

var day = document.getElementById("day");
day.addEventListener("click", addDays, false);

var month = document.getElementById("month");
month.addEventListener("click", addMonths, false);

var year = document.getElementById("year");
year.addEventListener("click", addYears, false);

var sel = document.getElementById("myForm");
sel.addEventListener("change", calculateAge, false);