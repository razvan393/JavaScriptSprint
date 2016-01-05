var tempX = 0;
var tempY = 0;

function changeColorXY (e) {
        tempX = e.pageX;
        tempY = e.pageY;

        if (tempX < 0) {
                tempX = 0;
        }
        if (tempY < 0) {
                tempY = 0;
        }

        document.body.style.backgroundColor = "hsl("+tempY+", "+tempX + "%, 50%)";

        return true;
}

var el = document.body;
el.addEventListener("mousemove", changeColorXY, false);