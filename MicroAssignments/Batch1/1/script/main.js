 function changeProgress () 
{
	var proRandom = getRandomInclusive ();
	var progres = document.querySelector("progress");
	progres.setAttribute("value", proRandom);
}


 function getRandomInclusive  () 
{
	var random = Math.floor(Math.random() * (100 +1));
	return random;
}


var btn = document.getElementById("button");
btn.addEventListener("click", changeProgress, false);