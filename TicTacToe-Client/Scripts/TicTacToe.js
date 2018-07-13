
// 3x3 Multidimensional Game array
var gameArray = new Array(3);

// Thickness of border for individual square on GameBoard
var squareBorderThickness = 0;

// Width of individual square on GameBoard
var squareWidth = 0;

// Which player starts the game?
var player = "circle";

$(document).ready(function () {
    // Retrieve first game board square
    var objGameBoardSquare = $('#square_0_0')[0]; // Native DOM element from jquery get()

    squareBorderThickness = getSquareLineThickness(objGameBoardSquare);
    squareWidth = objGameBoardSquare.scrollWidth - squareBorderThickness;

    generateGameArray(gameArray);
    registerSquareClickEvents(gameArray, squareWidth);

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

function registerSquareClickEvents(cubicArray, registerSquareWidth) {
    // GameBoard is a 3x3 matrix
    // Rows
    for (var i = 0; i < cubicArray.length; i++) {
        // Columns
        for (var j = 0; j < cubicArray[0].length; j++) {
            var refSquareName = "#" + "square" + "_" + i + "_" + j;

            // Register onclick event
            $(refSquareName).on('click', function () {
                clickSquare(this, registerSquareWidth);
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

function clickSquare(object, clickSquareWidth) {
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
            addCircle(row, column, clickSquareWidth);

            // Switch player
            player = "cross";
        } else if (player == "cross") {
            // Add object to GameBoard
            addCross(row, column, clickSquareWidth);

            // Switch player
            player = "circle";
        } else {
            // Error...
        }

        // Victory?
        checkVictory(gameArray, clickSquareWidth);
    }
}

function getSquareLineThickness(gameBoardSquare) {
    // Get style (for the clicked square)
    var squareStyle = gameBoardSquare.attributes["style"].value;
    var styleArray = squareStyle.split(";");

    // Get line thickness of the path (for the referenced GameBoard square)
    var borderThickness = 0;
    for (var i = 0; i < styleArray.length; i++) {
        var attributeArray = styleArray[i].split(':');
        if (attributeArray[0].trim() == "stroke-width") {
            borderThickness = Number(attributeArray[1].trim());
        }
    }

    return borderThickness;
}

function checkVictory(cubicArray, victorySquareWidth) {
    var result = false;
    var lineData = "";

    // Check for victory (3 objects in a line)

    // Row 1
    lineData = cubicArray[0][0] + "," + cubicArray[0][1] + "," + cubicArray[0][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryLine(victorySquareWidth, "row1");
        result = true;
    }

    // Row 2
    lineData = cubicArray[1][0] + "," + cubicArray[1][1] + "," + cubicArray[1][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryLine(victorySquareWidth, "row2");
        result = true;
    }

    // Row 3
    lineData = cubicArray[2][0] + "," + cubicArray[2][1] + "," + cubicArray[2][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryLine(victorySquareWidth, "row3");
        result = true;
    }

    // Column 1
    lineData = cubicArray[0][0] + "," + cubicArray[1][0] + "," + cubicArray[2][0];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryLine(victorySquareWidth, "column1");
        result = true;
    }

    // Column 2
    lineData = cubicArray[0][1] + "," + cubicArray[1][1] + "," + cubicArray[2][1];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryLine(victorySquareWidth, "column2");
        result = true;
    }

    // Column 3
    lineData = cubicArray[0][2] + "," + cubicArray[1][2] + "," + cubicArray[2][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryLine(victorySquareWidth, "column3");
        result = true;
    }

    // "Backslash" Diagonal ("\")
    lineData = cubicArray[0][0] + "," + cubicArray[1][1] + "," + cubicArray[2][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryLine(victorySquareWidth, "backSlash");
        result = true;
    }

    // "Forward Slash" Diagonal ("/")
    lineData = cubicArray[0][2] + "," + cubicArray[1][1] + "," + cubicArray[2][0];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryLine(victorySquareWidth, "forwardSlash");
        result = true;
    }

    if (result == true) {
        //alert("Victory!");
        //test(gameArray);
    }
}

// DRAWING SHAPES
function addCircle(row, col, squareSideLength) {
    // Draw SVG circle
    var objName = "circle" + "_" + row + "_" + col;
    var objCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    // Center
    var centerX = col * squareSideLength + 0.5 * squareSideLength;
    var centerY = row * squareSideLength + 0.5 * squareSideLength;

    // Attributes
    objCircle.setAttribute("id", objName);
    objCircle.setAttribute("style", "stroke:blue;fill:none;");
    objCircle.setAttribute("cx", centerX);
    objCircle.setAttribute("cy", centerY);
    objCircle.setAttribute("r", 0.4 * squareSideLength);

    // Draw object on SVG GameBoard
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
    var strPath = pathBackSlash + " " + pathOriginReturn + " " + pathForwardSlash;

    // Attributes
    objCross.setAttribute("id", objName);
    objCross.setAttribute("style", "stroke:red;fill:none;");
    objCross.setAttribute("d", strPath);

    // Draw object on SVG GameBoard
    $('#svgGameBoard').append(objCross);
}

function victoryLine(squareSideLength, orientation) {
    var objName = "victoryLine";
    var offsetEdge = 0.1;
    var offsetAxis = 0.2;

    //var objVictory = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var objVictory = document.createElementNS("http://www.w3.org/2000/svg", "line");

    var distanceFromEdge = offsetEdge * squareSideLength;
    var distanceOffAxis = offsetAxis * squareSideLength;

    var gameBoardSideLength = 3 * squareSideLength;
    var victoryLineLength = gameBoardSideLength - 2 * distanceFromEdge;

    var distanceOffAxisFromCenter = 0.5 * squareSideLength - 1 * distanceOffAxis; // centered line tilted slightly off axis
    var distanceOffAxisFromOrigin = 2 * distanceOffAxis; // twice the distance from origin of line tilted slightly off axis

    switch (orientation) {
        case "row1":
            // Starting Point
            var startX = distanceFromEdge;
            var startY = 0 * squareSideLength + distanceOffAxisFromCenter;

            // Distance (across 3 squares)
            var distanceX = victoryLineLength;
            var distanceY = distanceOffAxisFromOrigin;
            break;

        case "row2":
            // Starting Point
            var startX = distanceFromEdge;
            var startY = 1 * squareSideLength + distanceOffAxisFromCenter;

            // Distance (across 3 squares)
            var distanceX = victoryLineLength;
            var distanceY = distanceOffAxisFromOrigin;
            break;

        case "row3":
            // Starting Point
            var startX = distanceFromEdge;
            var startY = 2 * squareSideLength + distanceOffAxisFromCenter;

            // Distance (across 3 squares)
            var distanceX = victoryLineLength;
            var distanceY = distanceOffAxisFromOrigin;
            break;

        case "column1":
            // Starting Point
            var startX = 0 * squareSideLength + distanceOffAxisFromCenter;
            var startY = distanceFromEdge;

            // Distance (across 3 squares)
            var distanceX = distanceOffAxisFromOrigin;
            var distanceY = victoryLineLength;
            break;

        case "column2":
            // Starting Point
            var startX = 1 * squareSideLength + distanceOffAxisFromCenter;
            var startY = distanceFromEdge;

            // Distance (across 3 squares)
            var distanceX = distanceOffAxisFromOrigin;
            var distanceY = victoryLineLength;
            break;

        case "column3":
            // Starting Point
            var startX = 2 * squareSideLength + distanceOffAxisFromCenter;
            var startY = distanceFromEdge;

            // Distance (across 3 squares)
            var distanceX = distanceOffAxisFromOrigin;
            var distanceY = victoryLineLength;
            break;

        case "backSlash":
            // Starting Point
            var startX = distanceFromEdge;
            var startY = distanceOffAxisFromOrigin;

            // Distance (across 3 squares)
            var distanceX = victoryLineLength;
            var distanceY = gameBoardSideLength - 2 * distanceOffAxisFromOrigin;
            break;

        case "forwardSlash":
            // Starting Point
            var startX = gameBoardSideLength - distanceFromEdge;
            var startY = distanceOffAxisFromOrigin;

            // Distance (across 3 squares)
            var distanceX = -1 * victoryLineLength;
            var distanceY = gameBoardSideLength - 2 * distanceOffAxisFromOrigin;
            break;

        default:
    }

    // Path
    //var strPath = "m " + startX + " " + startY + " l " + distanceX + " " + distanceY;

    // Attributes
    objVictory.setAttribute("id", objName);
    //objVictory.setAttribute("style", "stroke-width:15;stroke:black;fill:none;opacity:1.0");
    //objVictory.setAttribute("d", strPath);

    objVictory.setAttribute("style", "stroke-width:15;stroke:black;stroke-linecap:round;fill:none;opacity:1.0");
    objVictory.setAttribute("x1", startX);
    objVictory.setAttribute("y1", startY);
    objVictory.setAttribute("x2", startX + distanceX);
    objVictory.setAttribute("y2", startY + distanceY);

    // Draw object on SVG GameBoard
    $('#svgGameBoard').append(objVictory);
}
