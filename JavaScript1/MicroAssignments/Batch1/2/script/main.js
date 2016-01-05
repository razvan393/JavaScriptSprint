var rate = document.getElementById("rate");

rate.addEventListener("mouseover", function ( event ) {
        var id = parseInt(event.target.id, 10);
        if ((id >0 ) && (id<6))
        {
        	document.getElementById("result").value = id;
        	var v = id.toString();
			numberStars (v, "&#9733");
        }
}, false);

rate.addEventListener("mouseout", function ( event ) {
        var id = parseInt(event.target.id, 10);
        if ((id >0 ) && (id<6))
        {
        	document.getElementById("result").value = "";
        	var v = id.toString();
        	numberStars (v, "&#9734");
        }
}, false);

function numberStars (a, text)
{
	for(var i =1; i<a; i++)
	{
		document.getElementById(i).innerHTML = text;
	}
}