function messaging (evt) {
	evt.preventDefault();
	var mesaj = document.getElementById("msg").value;
	var locMesaj = document.getElementById("msg")
	var contain = document.getElementById("chat");
	if(mesaj.length > 0)
	{
	contain.insertAdjacentHTML("beforeend","<div><img src='images/images.png' /><div class='add'><p>"+mesaj+"</p><span>John Dow</span></div></div>");
	locMesaj.value = "";
	locMesaj.focus(); 
	contain.lastChild.scrollIntoView();
	}
}

var buton = document.getElementById("form1");
buton.addEventListener("submit", messaging, false);
