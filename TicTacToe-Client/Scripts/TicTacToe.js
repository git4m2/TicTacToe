
// 3x3 Multidimensional Game array
var gameArray = new Array(3);

// Which player starts the game?
var player = "circle";

$(document).ready(function () {
    generateGameArray(gameArray);
    registerSquareClickEvents(gameArray);

    $('#btnTest').on('click', function () {
        test(gameArray);
    });
});

function generateGameArray(cubicArray) {
    // Multidimensional array
    for (var i = 0; i < cubicArray.length; i++) {
        gameArray[i] = new Array(cubicArray.length);
    }
}

function registerSquareClickEvents(cubicArray) {
    // GameBoard is a 3x3 matrix
    // Rows
    for (var i = 0; i < cubicArray.length; i++) {
        // Columns
        for (var j = 0; j < cubicArray[0].length; j++) {
            var refSquareName = "#" + "square" + "_" + i + "_" + j;

            // Register onclick event
            $(refSquareName).on('click', function () {
                squareClick(this);
            });
        }
    }
}

function test(cubicArray) {
    var arrayString = "";
    for (var i = 0; i < cubicArray.length; i++) {
        for (var j = 0; j < cubicArray[0].length; j++) {
            if (j == 0) {
                arrayString += cubicArray[i][j];
            } else {
                arrayString += "," + cubicArray[i][j];
            }
        }

        if (i < cubicArray.length - 1) {
            arrayString += "\n";
        }
    }

    alert("Game array: \n" + arrayString);
}

function squareClick(object) {
    //// Get style (for the clicked square)
    //var squareStyle = object.attributes["style"].value;
    //var styleArray = squareStyle.split(";");

    //// Get line width of the path (for the clicked square)
    //var lineWidth = "";
    //for (var i = 0; i < styleArray.length; i++) {
    //    var attributeArray = styleArray[i].split(':');
    //    if (attributeArray[0].trim() == "stroke-width") {
    //        lineWidth = Number(attributeArray[1].trim());
    //    }
    //}

    var lineWidth = getSquareLineWidth(object);

    // Get square width (for the clicked square)
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

        // Victory?
        checkVictory(gameArray);
    }
}

function getSquareLineWidth(gameBoardSquare) {
    // Get style (for the clicked square)
    var squareStyle = gameBoardSquare.attributes["style"].value;
    var styleArray = squareStyle.split(";");

    // Get line width of the path (for the referenced GameBoard square)
    var squareLineWidth = 0;
    for (var i = 0; i < styleArray.length; i++) {
        var attributeArray = styleArray[i].split(':');
        if (attributeArray[0].trim() == "stroke-width") {
            squareLineWidth = Number(attributeArray[1].trim());
        }
    }

    return squareLineWidth;
}

function checkVictory(cubicArray) {
    var result = false;
    var lineData = "";

    // Check for victory (3 objects in a line)

    // Row 1
    lineData = cubicArray[0][0] + "," + cubicArray[0][1] + "," + cubicArray[0][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        result = true;
    }

    // Row 2
    lineData = cubicArray[1][0] + "," + cubicArray[1][1] + "," + cubicArray[1][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        result = true;
    }

    // Row 3
    lineData = cubicArray[2][0] + "," + cubicArray[2][1] + "," + cubicArray[2][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        result = true;
    }

    // Column 1
    lineData = cubicArray[0][0] + "," + cubicArray[1][0] + "," + cubicArray[2][0];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        result = true;
    }

    // Column 2
    lineData = cubicArray[0][1] + "," + cubicArray[1][1] + "," + cubicArray[2][1];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        result = true;
    }

    // Column 3
    lineData = cubicArray[0][2] + "," + cubicArray[1][2] + "," + cubicArray[2][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        result = true;
    }

    // "Backslash" Diagonal ("\")
    lineData = cubicArray[0][0] + "," + cubicArray[1][1] + "," + cubicArray[2][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        result = true;
    }

    // "Forward Slash" Diagonal ("/")
    lineData = cubicArray[0][2] + "," + cubicArray[1][1] + "," + cubicArray[2][0];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        result = true;
    }

    if (result == true) {
        alert("Victory!");
        //test(gameArray);
    }
}

// DRAWING SHAPES
function addCircle(row, col, squareSideLength) {
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
    var objCross = document.createElementNS("http://www.w3.org/2000/svg", "path");

    // Distance
    var distanceX = 0.6 * squareSideLength;
    var distanceY = 0.6 * squareSideLength;

    // Backslash
    var startBackslashX = col * squareSideLength + 0.2 * squareSideLength;
    var startBackslashY = row * squareSideLength + 0.2 * squareSideLength;
    var pathBackSlash = "m " + startBackslashX + " " + startBackslashY + " l " + distanceX + " " + distanceY;

    // Return to origin path
    var pathOriginReturn = "m -" + (startBackslashX + distanceX) + " -" + (startBackslashY + distanceY);

    // Forward Slash
    var startForwardSlashX = col * squareSideLength + 0.8 * squareSideLength;
    var startForwardSlashY = row * squareSideLength + 0.2 * squareSideLength;
    var pathForwardSlash = "m " + startForwardSlashX + " " + startForwardSlashY + " l -" + distanceX + " " + distanceY;

    // Cross
    var pathCross = pathBackSlash + " " + pathOriginReturn + " " + pathForwardSlash;

    objCross.setAttribute("id", objName);
    objCross.setAttribute("style", "stroke:red;fill:none;");
    //objCross.setAttribute("d", pathBackSlash);
    //objCross.setAttribute("d", pathForwardSlash);
    objCross.setAttribute("d", pathCross);

    $('#svgGameBoard').append(objCross);
}

//function victoryCrossOut(row, col, squareSideLength, orientation) {
//    switch (orientation) {
//        case "row1":
//            break;
//        case "column1":
//            break;
//        case "backSlash":
//            var startX = 0.15 * squareSideLength;
//            var startY = 0.15 * squareSideLength;
//            var crossoutBeamDistance = 2.8 * squareSideLength;
//            objCross.setAttribute("d", "m " + startX + " " + startY + " l " + crossoutBeamDistance + " " + crossoutBeamDistance);
//            break;
//        case "forwardSlash":
//            break;
//        default:
//    }
//}
