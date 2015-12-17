function verify (evt) 
{
	evt.preventDefault();
	var nume = document.getElementById("nume").value;
	var prenume = document.getElementById("prenume").value;
	var email = document.getElementById("email").value;
	var check = document.getElementById("checkbox");
	var mesaj = document.getElementById("msg").value;
	var box = document.getElementById("box");
	var errors = [];
	var text = "";

	if (nume.length < 2)
	{
		errors.push("Numele trebuie sa aiba cel putin 2 caractere!");
	}
	if(prenume.length<2)
	{
		errors.push("Prenumele trebuie sa aiba cel putin 2 caractere!");
	}
	if(checkEmail(email)) {
		errors.push("Introduce-ti un email corect!"); 
	}
	if(!check.checked)
	{
		errors.push("Trebuie sa agreati conditiile!");
	}
	if(mesaj === "")
	{
		errors.push("Introduce-ti un mesaj!");
	}

	if(errors.length === 0)
	{
		text = "Thank you "+nume+" "+prenume+"!&#10084;"
		box.innerHTML = text;
		box.classList.add("disp-inl");
		document.getElementById("hide1").style.display = "none";
		document.getElementById("hide2").style.display = "none";
	}
	else
	{
		for(var i=0; i<errors.length; i++)
		{
			text += "<p>"+errors[i]+"</p>\n"; 
		}
		box.innerHTML = text;
		box.classList.add("disp-inl");
	}
}

function checkEmail (mail) 
{	
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return !filter.test(mail);
}


var start = document.getElementById("btn");
start.addEventListener("click", verify, false);