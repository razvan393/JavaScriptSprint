var tempX = 0;
var tempY = 0;

function getMouseXY (e) {
        tempX = e.pageX;
        tempY = e.pageY;

        if (tempX < 0) {
                tempX = 0;
        }
        if (tempY < 0) {
                tempY = 0;
        }
        document.getElementById("xmouse").value = tempX;
        document.getElementById("ymouse").value = tempY;

        document.getElementById("xmouse-procent").value = Math.floor(tempX*100/document.body.offsetWidth);
        document.getElementById("ymouse-procent").value = Math.floor(tempY*100/document.body.offsetHeight);
        return true;
}

var el = document.body;
el.addEventListener("mousemove", getMouseXY, false);