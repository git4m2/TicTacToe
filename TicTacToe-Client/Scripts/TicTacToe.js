
// 3x3 Multidimensional Game array
var gameArray = new Array(3);

// Which player starts the game?
var player = "circle";

$(document).ready(function () {
    $('#btnTest').on('click', test);

    generateGameArray(gameArray);
    registerSquareClickEvents();
});

function test() {
    var arrayString = "";
    for (var i = 0; i < gameArray.length; i++) {
        for (var j = 0; j < gameArray[0].length; j++) {
            if (j == 0) {
                arrayString += gameArray[i][j];
            }
            else {
                arrayString += "," + gameArray[i][j];
            }
        }

        if (i < gameArray.length - 1) {
            arrayString += "\n";
        }
    }

    alert("Game array: \n" + arrayString);
}

function generateGameArray(cubicArray) {
    // Multidimensional array
    for (var i = 0; i < cubicArray.length; i++) {
        gameArray[i] = new Array(cubicArray.length);
    }
}

function registerSquareClickEvents() {
    // GameBoard is a 3x3 matrix
    // Rows
    for (var i = 0; i < 3; i++) {
        // Columns
        for (var j = 0; j < 3; j++) {
            var refSquareName = "#" + "square" + "_" + i + "_" + j;

            // Register onclick event
            $(refSquareName).on('click', function () {
                squareClick(this);
            });
        }
    }
}

function squareClick(object) {
    // Get style (for the clicked square)
    var squareStyle = object.attributes["style"].value;
    var styleArray = squareStyle.split(";");

    // Get line width of the path (for the clicked square)
    var lineWidth = "";
    for (var i = 0; i < styleArray.length; i++) {
        var attributeArray = styleArray[i].split(':');
        if (attributeArray[0].trim() == "stroke-width") {
            lineWidth = Number(attributeArray[1].trim());
        }
    }

    // Get width (for the clicked square)
    var squareWidth = object.scrollWidth - lineWidth;

    // Get [row][column] info (for the clicked square)
    var objectNameArray = object.id.split("_");
    var row = objectNameArray[1];
    var column = objectNameArray[2];

    // Does an object (circle or cross) already exist in the game array (i.e. duplicates)?
    if (gameArray[row][column] === undefined) {
        // Add object to Game array
        gameArray[row][column] = player; // "circle" or "cross"

        // Current player?
        if (player == "circle") {
            // Add object to GameBoard
            addCircle(row, column, squareWidth);

            // Switch player
            player = "cross";
        } else if (player == "cross") {
            // Add object to GameBoard
            addCross(row, column, squareWidth);

            // Switch player
            player = "circle";
        } else {
            // Error...
        }
    }
}

function addCircle(row, col, squareSideLength) {
    // 
    // Draw SVG circle
    var objName = "circle" + "_" + row + "_" + col;
    var centerX = col * squareSideLength + 0.5 * squareSideLength;
    var centerY = row * squareSideLength + 0.5 * squareSideLength;
    var objCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    objCircle.setAttribute("id", objName);
    objCircle.setAttribute("style", "stroke:blue;fill:none;");
    objCircle.setAttribute("cx", centerX);
    objCircle.setAttribute("cy", centerY);
    objCircle.setAttribute("r", 0.4 * squareSideLength);

    $('#svgGameBoard').append(objCircle);
}

function addCross(row, col, squareSideLength) {
    // Draw SVG cross
    var objName = "cross" + "_" + row + "_" + col;
    var startX = col * squareSideLength + 0.2 * squareSideLength;
    var startY = row * squareSideLength + 0.2 * squareSideLength;
    var crossBeamDistance = 0.6 * squareSideLength;
    var objCross = document.createElementNS("http://www.w3.org/2000/svg", "path");
    objCross.setAttribute("id", objName);
    objCross.setAttribute("style", "stroke:red;fill:none;");
    objCross.setAttribute("d", "m " + startX + " " + startY + " l " + crossBeamDistance + " " + crossBeamDistance + " m 0 -" + crossBeamDistance + " l -" + crossBeamDistance + " " + crossBeamDistance);

    $('#svgGameBoard').append(objCross);
}
