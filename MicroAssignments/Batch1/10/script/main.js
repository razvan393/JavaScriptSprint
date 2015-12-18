// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
 
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
   
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

//My script

function verify (evt) 
{
	evt.preventDefault();
	var nume = document.getElementById("nume").value;
	var prenume = document.getElementById("prenume").value;
	var email = document.getElementById("email").value;
	var check = document.getElementById("checkbox");
	var mesaj = document.getElementById("msg").value;
	var box = document.getElementById("box");
	var thanks = document.getElementById("showMessage");
	var container = document.getElementById("container"); 
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
		text = tmpl('msg_template', {nume:nume,prenume:prenume});
		showMessage.innerHTML = text;
		//text="Thank you "+nume+" "+prenume+"!&#10084"
		//document.getElementById("text-p").innerHTML = text;
		container.classList.remove("nonMessage");
		container.classList.add("Message");
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