// 3x3 Multidimensional Game array
var gameArray = new Array(3);

// Which player starts the game?
var player = "circle";

$(document).ready(function () {
    generateGameArray(gameArray);

    // Width of individual square on GameBoard (using Bounding Box)
    //var squareWidth = document.getElementById("square_0_0").getBBox().width;
    var squareWidth = $("#square_0_0")[0].getBBox().width;

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

function checkVictory(cubicArray, victorySquareWidth) {
    var result = false;
    var lineData = "";

    // Check for victory (3 objects in a line)

    // Row 1
    lineData = cubicArray[0][0] + "," + cubicArray[0][1] + "," + cubicArray[0][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryStrikeThrough(victorySquareWidth, "row1");
        result = true;
    }

    // Row 2
    lineData = cubicArray[1][0] + "," + cubicArray[1][1] + "," + cubicArray[1][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryStrikeThrough(victorySquareWidth, "row2");
        result = true;
    }

    // Row 3
    lineData = cubicArray[2][0] + "," + cubicArray[2][1] + "," + cubicArray[2][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryStrikeThrough(victorySquareWidth, "row3");
        result = true;
    }

    // Column 1
    lineData = cubicArray[0][0] + "," + cubicArray[1][0] + "," + cubicArray[2][0];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryStrikeThrough(victorySquareWidth, "column1");
        result = true;
    }

    // Column 2
    lineData = cubicArray[0][1] + "," + cubicArray[1][1] + "," + cubicArray[2][1];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryStrikeThrough(victorySquareWidth, "column2");
        result = true;
    }

    // Column 3
    lineData = cubicArray[0][2] + "," + cubicArray[1][2] + "," + cubicArray[2][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryStrikeThrough(victorySquareWidth, "column3");
        result = true;
    }

    // "Backslash" Diagonal ("\")
    lineData = cubicArray[0][0] + "," + cubicArray[1][1] + "," + cubicArray[2][2];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryStrikeThrough(victorySquareWidth, "backSlash");
        result = true;
    }

    // "Forward Slash" Diagonal ("/")
    lineData = cubicArray[0][2] + "," + cubicArray[1][1] + "," + cubicArray[2][0];
    if (lineData == "circle,circle,circle" || lineData == "cross,cross,cross") {
        victoryStrikeThrough(victorySquareWidth, "forwardSlash");
        result = true;
    }

    if (result == true) {
        //alert("Victory!");
        //test(gameArray);
    }
}

function polarX(polarRadius, polarAngle) {
    // polarAngle passed in degrees, theta calculated in radians
    var theta = Math.PI / 180 * polarAngle;
    var polarDistanceX = polarRadius * Math.cos(theta);

    return polarDistanceX;
}

function polarY(polarRadius, polarAngle) {
    // polarAngle passed in degrees, theta calculated in radians
    var theta = Math.PI / 180 * polarAngle;
    var polarDistanceY = polarRadius * Math.sin(theta);

    return polarDistanceY;
}

// DRAWING SHAPES
function addCircle(row, col, squareSideLength) {
    // Draw SVG circle
    var objName = "circle" + "_" + row + "_" + col;
    var objCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    // Attributes
    objCircle.setAttribute("id", objName);
    objCircle.setAttribute("style", "stroke:blue;fill:none;");

    // Offsets
    var offsetSquareSideLength = 0.5 * squareSideLength;

    // Center
    var centerX = col * squareSideLength + offsetSquareSideLength;
    var centerY = row * squareSideLength + offsetSquareSideLength;

    // Polar values
    var radius = 0.4 * squareSideLength;

    // Attributes
    objCircle.setAttribute("cx", centerX);
    objCircle.setAttribute("cy", centerY);
    objCircle.setAttribute("r", radius);

    // Draw object on SVG GameBoard
    $('#svgGameBoard').append(objCircle);
}

function addCross(row, col, squareSideLength) {
    // Draw SVG cross
    var objName = "cross" + "_" + row + "_" + col;
    var objCross = document.createElementNS("http://www.w3.org/2000/svg", "path");

    // Attributes
    objCross.setAttribute("id", objName);
    objCross.setAttribute("style", "stroke:red;fill:none;");

    // Offsets
    var offsetSquareSideLength = 0.5 * squareSideLength;

    // Center
    var centerX = col * squareSideLength + offsetSquareSideLength;
    var centerY = row * squareSideLength + offsetSquareSideLength;

    // Polar values
    var angle = "";
    var radius = 0.4 * squareSideLength;

    // Radial Path
    var radialPath = "";

    // Return to origin
    var pathOriginReturn = "";

    // Move to center of square
    var strPath = "m " + centerX + " " + centerY;

    // Generate paths for 4 radial lines (from center)
    for (var i = 0; i < 4; i++) {
        angle = i * 90 + 45;

        // Radial Distance
        var distanceX = polarX(radius, angle);
        var distanceY = polarY(radius, angle);

        // Radial Path
        radialPath = "l " + distanceX + " " + distanceY;

        // Return to origin
        pathOriginReturn = "m " + (-1 * distanceX) + " " + (-1 * distanceY);

        // Cross
        strPath += " " + radialPath + " " + pathOriginReturn;
    }

    // Attributes
    objCross.setAttribute("d", strPath);

    // Draw object on SVG GameBoard
    $('#svgGameBoard').append(objCross);
}

function victoryStrikeThrough(squareSideLength, orientation) {
    // Draw SVG Victory Strikethrough
    var objName = "victoryStrikeThrough";
    var objVictory = document.createElementNS("http://www.w3.org/2000/svg", "path");

    // Attributes
    objVictory.setAttribute("id", objName);
    objVictory.setAttribute("style", "stroke-width:15;stroke:black;stroke-linecap:round;fill:none;opacity:1.0;");

    // Offsets
    var offsetSquareSideLength = 0.5 * squareSideLength;
    var offsetEdge = 0.1 * squareSideLength; // distance from edge
    var offsetAngle = -5; // degrees offset from axis

    // Center
    var centerX = offsetSquareSideLength;
    var centerY = offsetSquareSideLength;

    // Polar values
    var angle = 0 + offsetAngle;
    var radius = 1 * squareSideLength + offsetSquareSideLength - offsetEdge;

    // Radial Path
    var radialPath = "";

    // Return to origin
    var pathOriginReturn = "";

    switch (orientation) {
        case "row1":
            // Center Point
            centerX += 1 * squareSideLength;
            centerY += 0 * squareSideLength;
            break;

        case "row2":
            // Center Point
            centerX += 1 * squareSideLength;
            centerY += 1 * squareSideLength;
            break;

        case "row3":
            // Center Point
            centerX += 1 * squareSideLength;
            centerY += 2 * squareSideLength;
            break;

        case "column1":
            // Center Point
            centerX += 0 * squareSideLength;
            centerY += 1 * squareSideLength;

            // Polar values
            angle += 90;
            break;

        case "column2":
            // Center Point
            centerX += 1 * squareSideLength;
            centerY += 1 * squareSideLength;

            // Polar values
            angle += 90;
            break;

        case "column3":
            // Center Point
            centerX += 2 * squareSideLength;
            centerY += 1 * squareSideLength;

            // Polar values
            angle += 90;
            break;

        case "backSlash":
            // Center Point
            centerX += 1 * squareSideLength;
            centerY += 1 * squareSideLength;

            // Polar values
            radius += 4 * offsetEdge;
            angle += 45;
            break;

        case "forwardSlash":
            // Center Point
            centerX += 1 * squareSideLength;
            centerY += 1 * squareSideLength;

            // Polar values
            radius += 4 * offsetEdge;
            angle += 135;
            break;

        default:
    }

    // Move to center of square
    var strPath = "m " + centerX + " " + centerY;

    // Generate paths for 2 opposing radial lines (from center)
    for (var i = 0; i < 2; i++) {
        angle += i * 180;

        // Radial Distance
        var distanceX = polarX(radius, angle);
        var distanceY = polarY(radius, angle);

        // Radial Path
        radialPath = "l " + distanceX + " " + distanceY;

        // Return to origin
        pathOriginReturn = "m " + (-1 * distanceX) + " " + (-1 * distanceY);

        // Strikethrough
        strPath += " " + radialPath + " " + pathOriginReturn;
    }

    // Attributes
    objVictory.setAttribute("d", strPath);

    // Draw object on SVG GameBoard
    $('#svgGameBoard').append(objVictory);
}
