// 3x3 Multidimensional Game array
var gameArray = new Array(3);

// Which gamePiece starts the game?
var gamePiece = "circle";

// Current User
var currentUser = "";

$(document).ready(function () {
    initialize();
});

/// INITIALIZATION
function initialize() {
    socket = io.connect('http://localhost:1337');
    socket.on('connect', addUser);
    socket.on('updateusers', updateUserList);
    socket.on('updatechat', processMessage);

    generateGameArray(gameArray);

    registerSquareClickEvents(gameArray);

    $('#btnTest').on('click', function () {
        test(gameArray);
    });

}

// SOCKET MESSAGING
function addUser() {
    currentUser = prompt("What's your name?");
    $('#userID').text(currentUser);
    socket.emit('adduser', currentUser);
}

function updateUserList(data) {
    $('#users').empty();
    $.each(data, function (key, value) {
        // Update webpage with user info
        //$('#users').append('<div>' + key + '</div>');
        $('#users').append('<div>' + key + ": " + value + '</div>');
    });
}

function processMessage(username, data) {
    $('<b>' + username + ':</b> ' + data + '</br>').insertAfter($('#conversation'));

    // Was a square clicked?
    if (isSquareReference(data)) {
        var objSquare = $("#" + data)[0];
        clickSquare(objSquare);
        //clickSquare(objSquare, username);
    }
}

function sendMessage(squareName, playerMarker) {
    var message = squareName;
    socket.emit('sendchat', message, playerMarker);
}

/// GAME ARRAY
function generateGameArray(squareArray) {
    // Multidimensional array
    for (var i = 0; i < squareArray.length; i++) {
        gameArray[i] = new Array(squareArray.length);
    }
}

/// TEST DISPLAY
function test(squareArray) {
    var arrayString = "";
    for (var i = 0; i < squareArray.length; i++) {
        for (var j = 0; j < squareArray[0].length; j++) {
            if (j === 0) {
                arrayString += squareArray[i][j];
            } else {
                arrayString += "," + squareArray[i][j];
            }
        }

        if (i < squareArray.length - 1) {
            arrayString += "\n";
        }
    }

    alert("Game array: \n" + arrayString);
}

/// REGISTER CLICK EVENTS
function registerSquareClickEvents(squareArray) {
    // GameBoard is a 3x3 matrix
    // Rows
    for (var i = 0; i < squareArray.length; i++) {
        // Columns
        for (var j = 0; j < squareArray[0].length; j++) {
            var refSquareName = "#" + "square" + "_" + i + "_" + j;

            // Register onclick event
            $(refSquareName).on('click', function () {
                clickSquare(this);
            });
        }
    }
}

function clickSquare(object) {
    // Get values for the referenced square
    var row = getRowNumber(object.id);
    var column = getColumnNumber(object.id);

    // Does an object (circle or cross) already exist in the game array (i.e. duplicates)?
    if (gameArray[row][column] === undefined) {

        // Add object to Game array
        gameArray[row][column] = gamePiece; // "circle" or "cross"

        // Current gamePiece?
        if (gamePiece === "circle") {
            // Add object to GameBoard
            drawCircle(object.id);

            // Send Message
            sendMessage(object.id, gamePiece);

            // Switch gamePiece
            gamePiece = "cross";
        } else if (gamePiece === "cross") {
            // Add object to GameBoard
            drawCross(object.id);

            // Send Message
            sendMessage(object.id, gamePiece);

            // Switch gamePiece
            gamePiece = "circle";
        } else {
            // Error...
        }

        // Victory?
        checkVictory(gameArray);
    }
}

function getRowNumber(refSquareName) {
    // Get [row][column] info for the referenced square
    var objectNameArray = refSquareName.split("_");
    var row = objectNameArray[1];
    return row;
}

function getColumnNumber(refSquareName) {
    // Get [row][column] info for the referenced square
    var objectNameArray = refSquareName.split("_");
    var column = objectNameArray[2];
    return column;
}

function getSquareWidth(refSquareName) {
    // Get width for the referenced square
    var squareWidth = $("#" + refSquareName)[0].getBBox().width;
    return squareWidth;
}

function isSquareReference(data) {
    var pattern = /square_[0-2]_[0-2]/;
    var isMatch = pattern.test(data); // true or false
    return isMatch;
}

function checkVictory(squareArray) {
    var victory = false;
    var lineData = "";

    // Check for victory (3 objects in a line)

    // Row 1
    lineData = squareArray[0][0] + "," + squareArray[0][1] + "," + squareArray[0][2];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        drawVictoryStrikeThrough("row1");
        victory = true;
    }

    // Row 2
    lineData = squareArray[1][0] + "," + squareArray[1][1] + "," + squareArray[1][2];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        drawVictoryStrikeThrough("row2");
        victory = true;
    }

    // Row 3
    lineData = squareArray[2][0] + "," + squareArray[2][1] + "," + squareArray[2][2];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        drawVictoryStrikeThrough("row3");
        victory = true;
    }

    // Column 1
    lineData = squareArray[0][0] + "," + squareArray[1][0] + "," + squareArray[2][0];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        drawVictoryStrikeThrough("column1");
        victory = true;
    }

    // Column 2
    lineData = squareArray[0][1] + "," + squareArray[1][1] + "," + squareArray[2][1];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        drawVictoryStrikeThrough("column2");
        victory = true;
    }

    // Column 3
    lineData = squareArray[0][2] + "," + squareArray[1][2] + "," + squareArray[2][2];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        drawVictoryStrikeThrough("column3");
        victory = true;
    }

    // "Backslash" Diagonal ("\")
    lineData = squareArray[0][0] + "," + squareArray[1][1] + "," + squareArray[2][2];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        drawVictoryStrikeThrough("backSlash");
        victory = true;
    }

    // "Forward Slash" Diagonal ("/")
    lineData = squareArray[0][2] + "," + squareArray[1][1] + "," + squareArray[2][0];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        drawVictoryStrikeThrough("forwardSlash");
        victory = true;
    }

    if (victory === true) {
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

/// DRAWING SHAPES
function drawCircle(refSquareName) {
    // Get values for the referenced square
    var row = getRowNumber(refSquareName);
    var column = getColumnNumber(refSquareName);
    var squareSideLength = getSquareWidth(refSquareName);

    // Draw SVG circle
    var objName = "circle" + "_" + row + "_" + column;
    var objCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    // Attributes
    objCircle.setAttribute("id", objName);
    objCircle.setAttribute("style", "stroke:blue;fill:none;");

    // Offsets
    var offsetSquareSideLength = 0.5 * squareSideLength;

    // Center
    var centerX = column * squareSideLength + offsetSquareSideLength;
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

function drawCross(refSquareName) {
    // Get values for the referenced square
    var row = getRowNumber(refSquareName);
    var column = getColumnNumber(refSquareName);
    var squareSideLength = getSquareWidth(refSquareName);

   // Draw SVG cross
    var objName = "cross" + "_" + row + "_" + column;
    var objCross = document.createElementNS("http://www.w3.org/2000/svg", "path");

    // Attributes
    objCross.setAttribute("id", objName);
    objCross.setAttribute("style", "stroke:red;fill:none;");

    // Offsets
    var offsetSquareSideLength = 0.5 * squareSideLength;

    // Center
    var centerX = column * squareSideLength + offsetSquareSideLength;
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

function drawVictoryStrikeThrough(orientation) {
    // Get values for the referenced square
    var refSquareName = "square_0_0";
    var squareSideLength = getSquareWidth(refSquareName);

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
