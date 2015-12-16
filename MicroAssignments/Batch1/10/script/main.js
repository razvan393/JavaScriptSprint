function verify (evt) 
{
	evt.preventDefault();
	var nume = document.getElementById("nume").value;
	var prenume = document.getElementById("prenume").value;
	var email = document.getElementById("email").value;
	var check = document.getElementById("checkbox");
	var mesaj = document.getElementById("msg").value;
	var box = document.getElementById("box");
	var output = new Array();
	var text = "";

	if(nume.length<2)
	{
		output.push("Numele trebuie sa aiba cel putin 3 caractere!");
	}
	if(prenume.length<2)
	{
		output.push("Prenumele trebuie sa aiba cel putin 3 caractere!");
	}
	if(checkEmail(email)) {
		output.push("Introduce-ti un email corect!"); 
	}
	if(!check.checked)
	{
		output.push("Trebuie sa agreati conditiile!");
	}
	if(mesaj === "")
	{
		output.push("Introduce-ti un mesaj!");
	}

	if(output.length === 0)
	{
		text = "Thank you "+nume+" "+prenume+"!&#10084;"
		box.insertAdjacentHTML("beforeend", text);
		box.classList.add("disp-inl");
		document.getElementById("hide1").style.display = "none";
		document.getElementById("hide2").style.display = "none";
	}
	else
	{
		for(var i=0; i<output.length; i++)
		{
			text += "<p>"+output[i]+"</p>\n"; 
		}
		box.insertAdjacentHTML("beforeend", text);
		box.classList.add("disp-inl");
	}
}

function checkEmail (mail) 
{	
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (!filter.test(mail))
	{
		return true;
	}
	else
	{
		return false;
	}
}


var start = document.getElementById("btn");
start.addEventListener("click", verify, false);