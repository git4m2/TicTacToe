var GameBoardSquares = {};

$(document).ready(function () {
    initialize();
});

/// INITIALIZATION
function initialize() {
    socket = io.connect('http://localhost:1337');
    socket.on('connect', addUser);
    socket.on('updateusers', updateUserList);
    socket.on('updatechat', processMessage);
    socket.on('squareSelected', selectSquare);
    socket.on('victory', drawVictoryStrikeThrough);

    drawGameBoardSquares();

    registerSquareClickEvents(GameBoardSquares);

    //$('#btnTest').on('click', function () {
    //    test(gameArray);
    //});

}

// SOCKET MESSAGING
function addUser() {
    var currentUser = prompt("What's your name?");
    $('#userID').text(currentUser);
    socket.emit('adduser', currentUser);
}

function updateUserList(data) {
    $('#users').empty();
    $.each(data, function (key, value) {
        // Update webpage with user info
        $('#users').append('<div>' + key + ": " + value + '</div>');
    });
}

function processMessage(username, data) {
    $('<b>' + username + ':</b> ' + data + '</br>').insertAfter($('#conversation'));
}

function sendMessage(squareName, playerMarker) {
    var message = squareName;
    socket.emit('sendchat', message, playerMarker);
}

function selectSquare(squareName, gamePiece) {
    if (gamePiece === "circle") {
        drawCircle(squareName);
    } else if (gamePiece === "cross") {
        drawCross(squareName);
    } else if (gamePiece === "disallow") {
        drawDisallow(squareName);
    } else {
        // Error...
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
    $.each(squareArray, function (refSquareArray) {
        var refSquareName = "#" + refSquareArray;

        // Register onclick event
        $(refSquareName).on('click', function () {
            clickSquare(this);
        });
    });
}

function clickSquare(object) {
    socket.emit('clickSquare', object.id);
}

/// DETERMINISTIC ALGORITHMS
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
function drawGameBoardSquares() {
    // Draw GameBoard Squares
    // *** Without "fill:transparent", mouse click event handlers cannot be hooked to the squares. ***

    GameBoardSquares["square_0_0"] = '{"target":"svgGameBoard", "centerX":50, "centerY":50, "squareWidth":100, "squareHeight":100, "lineWidth":5, "lineColor":"black", "fillStyle":"transparent"}';
    GameBoardSquares["square_0_1"] = '{"target":"svgGameBoard", "centerX":150, "centerY":50, "squareWidth":100, "squareHeight":100, "lineWidth":5, "lineColor":"black", "fillStyle":"transparent"}';
    GameBoardSquares["square_0_2"] = '{"target":"svgGameBoard", "centerX":250, "centerY":50, "squareWidth":100, "squareHeight":100, "lineWidth":5, "lineColor":"black", "fillStyle":"transparent"}';

    GameBoardSquares["square_1_0"] = '{"target":"svgGameBoard", "centerX":50, "centerY":150, "squareWidth":100, "squareHeight":100, "lineWidth":5, "lineColor":"black", "fillStyle":"transparent"}';
    GameBoardSquares["square_1_1"] = '{"target":"svgGameBoard", "centerX":150, "centerY":150, "squareWidth":100, "squareHeight":100, "lineWidth":5, "lineColor":"black", "fillStyle":"transparent"}';
    GameBoardSquares["square_1_2"] = '{"target":"svgGameBoard", "centerX":250, "centerY":150, "squareWidth":100, "squareHeight":100, "lineWidth":5, "lineColor":"black", "fillStyle":"transparent"}';

    GameBoardSquares["square_2_0"] = '{"target":"svgGameBoard", "centerX":50, "centerY":250, "squareWidth":100, "squareHeight":100, "lineWidth":5, "lineColor":"black", "fillStyle":"transparent"}';
    GameBoardSquares["square_2_1"] = '{"target":"svgGameBoard", "centerX":150, "centerY":250, "squareWidth":100, "squareHeight":100, "lineWidth":5, "lineColor":"black", "fillStyle":"transparent"}';
    GameBoardSquares["square_2_2"] = '{"target":"svgGameBoard", "centerX":250, "centerY":250, "squareWidth":100, "squareHeight":100, "lineWidth":5, "lineColor":"black", "fillStyle":"transparent"}';

    $.each(GameBoardSquares, function (name, objGameSquare) {
        var objSquare = JSON.parse(objGameSquare);

        drawSvgSquare(name, objSquare.target, objSquare.centerX, objSquare.centerY, objSquare.squareWidth, objSquare.squareHeight, objSquare.lineWidth, objSquare.lineColor, objSquare.fillStyle);
    });

    //drawSvgCircle("circle_0_0", "svgGameBoard", 50, 50, 40, 5, "blue", "none");
}

function drawSvgSquare(squareName, svgTarget, xCenter, yCenter, rectWidth, rectHeight, strokeWidth, stroke, fill) {
    var objSquare = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var styleInfo = "stroke-width:" + strokeWidth + ";stroke:" + stroke + ";fill:" + fill + ";";
    var target = "#" + svgTarget;
    var path = "";

    path += "m ";
    path += (xCenter - rectWidth / 2).toString() + " " + (yCenter - rectHeight / 2).toString();
    path += " l ";
    path += rectWidth.toString() + " " + (0).toString();
    path += " " + (0).toString() + " " + rectHeight.toString();
    path += " " + (-1 * rectWidth).toString() + " " + (0).toString();
    path += " z";

    objSquare.setAttribute("style", styleInfo);
    objSquare.setAttribute("id", squareName);
    objSquare.setAttribute("d", path);

    $(target).append(objSquare);
}

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

function drawSvgCircle(circleName, svgTarget, xCenter, yCenter, circleRadius, strokeWidth, stroke, fill) {
    var objCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    var styleInfo = "stroke-width:" + strokeWidth + ";stroke:" + stroke + ";fill:" + fill + ";";
    var target = "#" + svgTarget;

    objCircle.setAttribute("id", circleName);
    objCircle.setAttribute("style", styleInfo);
    objCircle.setAttribute("cx", xCenter);
    objCircle.setAttribute("cy", yCenter);
    objCircle.setAttribute("r", circleRadius);

    $(target).append(objCircle);
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

function drawDisallow(refSquareName) {

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
