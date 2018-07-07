$(document).ready(function () {
    //$('#btnTest').on('click', test);

    setupSquareClicks();

});

function setupSquareClicks() {
    // GameBoard is a 3x3 matrix
    var i = 0;
    var j = 0;

    // Rows
    for (i = 0; i < 3; i++) {
        // Columns
        for (j = 0; j < 3; j++) {
            var refSquareName = "#" + "square" + "_" + i + "_" + j;

            $(refSquareName).on('click', function () {
                //var info = this.attributes["style"].value;
                //info = "path = " + info;
                //alert(info);

                var objectNameArray = this.id.split("_");
                //addCircle(objectNameArray[1], objectNameArray[2]);
                addCross(objectNameArray[1], objectNameArray[2]);
            });
        }
    }
}

function addCircle(row, col) {
    var objName = "circle" + "_" + row + "_" + col;
    var centerX = col * 100 + 50;
    var centerY = row * 100 + 50;
    var objCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    objCircle.setAttribute("id", objName);
    objCircle.setAttribute("style", "stroke:blue;fill:none;");
    objCircle.setAttribute("cx", centerX);
    objCircle.setAttribute("cy", centerY);
    objCircle.setAttribute("r", "40");

    $('#svgGameBoard').append(objCircle);
}

function addCross(row, col) {
    var objName = "cross" + "_" + row + "_" + col;
    var startX = col * 100 + 20;
    var startY = row * 100 + 20;
    var objCross = document.createElementNS("http://www.w3.org/2000/svg", "path");
    objCross.setAttribute("id", objName);
    objCross.setAttribute("style", "stroke:red;fill:none;");
    objCross.setAttribute("d", "m " + startX + " " + startY + " l 60 60 m 0 -60 l -60 60");

    $('#svgGameBoard').append(objCross);
}
