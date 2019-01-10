
// #region EXAMPLE
// #endregion


// #region GLOBAL VARIABLES
var gameBoardName = "";
var offsetAngle = -5;
var radiusMultiplier = 0.4;
// #endregion


// #region INITIALIZATION
///////////////////////////////////////////////////////////////////////////////
///                             INITIALIZATION                              ///
///////////////////////////////////////////////////////////////////////////////

function initialize() {
    socket = io.connect('http://localhost:1337');
    socket.on('connect', addUser);
    socket.on('updateusers', updateUserList);
    socket.on('updatechat', processMessage);
    socket.on('circleSelected', drawSvgCircle);
    socket.on('crossSelected', drawSvgCross);
    socket.on('victory', drawSvgRadialLine);
    socket.on('endgame', endGame);
    socket.on('cleargameboard', clearGameboard);
    //socket.on('disableNewGameButton', disableNewGameButton);
    //socket.on('newgame', newGame);

    gameBoardName = "svgGameBoard";

    // Disable button
    $('#btnNewGame').attr('disabled', 'disabled');

    clearGameboard();

    // New Game Board button
    $('#btnNewGame').on('click', function () {
        //clearGameboard();
        socket.emit('cleargame');
    });


    ///////////////////////////////////
    ///        TEST DATA            ///
    ///////////////////////////////////

    $('#btnTest').on('click', function () {
        //drawSvgSquare("tile_0_0");
        //drawSvgCircle("tile_0_1");
        //drawSvgCross("tile_0_2");
        //drawSvgRadialLine("tile_1_1", "tile_2_2");

        // Test Info
        //$('#conversation').text('Square: ' + square1.styleInfo);

        // Enable NewGameBoard button
        disableNewGameButton(false);
    });
}
// #endregion


// #region DOCUMENT READY
$(document).ready(function () {
    initialize();
});
// #endregion


// #region NEW GAME
///////////////////////////////////////////////////////////////////////////////
///                                NEW GAME                                 ///
///////////////////////////////////////////////////////////////////////////////

function endGame(data) {
    disableNewGameButton(false);
    $('#conversation').text('Winner: ' + data.winner);
}

function disableNewGameButton(value) {
    if (value === "true") {
        //$('#btnNewGame').disabled = true;
        $('#btnNewGame').attr('disabled', 'disabled');

    } else {
        //$('#btnNewGame').disabled = false;
        $('#btnNewGame').removeAttr('disabled');

    }
}

function clearGameboard() {
    if ($('#' + gameBoardName).length) {
        $('#' + gameBoardName).remove();
    }

    drawSvgGameBoard();
    drawSvgTiles();
    registerTileClickEvents();
}
// #endregion


// #region SOCKET MESSAGING
///////////////////////////////////////////////////////////////////////////////
///                            SOCKET MESSAGING                             ///
///////////////////////////////////////////////////////////////////////////////

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

function sendMessage(tileName, playerMarker) {
    var message = tileName;
    socket.emit('sendchat', message, playerMarker);
}
// #endregion


// #region TEST DISPLAY
///////////////////////////////////////////////////////////////////////////////
///                              TEST DISPLAY                               ///
///////////////////////////////////////////////////////////////////////////////
// #endregion


// #region REGISTER CLICK EVENTS
///////////////////////////////////////////////////////////////////////////////
///                         REGISTER CLICK EVENTS                           ///
///////////////////////////////////////////////////////////////////////////////

function registerTileClickEvents() {
    for (row = 0; row < 3; row++) {
        for (column = 0; column < 3; column++) {
            var tileName = "tile" + "_" + row + "_" + column;

            // Register onclick event
            $("#" + tileName).on('click', function () {
                clickTile(this);
            });
        }
    }
}

function clickTile(object) {
    socket.emit('clickTile', object.id);
}
// #endregion


// #region DRAWING SHAPES
///////////////////////////////////////////////////////////////////////////////
///                             DRAWING SHAPES                              ///
///////////////////////////////////////////////////////////////////////////////

function drawSvgGameBoard() {
    // Initialize Object
    var GameBoard = new SvgGameBoard();

    // Draw Object
    GameBoard.draw();
}

function drawSvgTiles() {
    // Draw GameBoard Tiles
    for (row = 0; row < 3; row++) {
        for (column = 0; column < 3; column++) {
            // Initialize Object
            var tile = new SvgSquare();
            tile.id = "tile_" + row + "_" + column;
            tile.width = 100;
            tile.height = 100;
            tile.centerX = tile.width * column + tile.width / 2;
            tile.centerY = tile.height * row + tile.height / 2;
            //tile.strokeWidth  = 5;
            tile.stroke = "gray";
            tile.fill = "transparent"; // *** Without "fill:transparent", mouse click event handlers cannot be hooked to the rectangles. ***
            //tile.opacity = 1.0;
            tile.target = gameBoardName;

            // Draw Object
            tile.draw();
        }
    }
}

function drawSvgSquare(tile) {
    // Initialize Object
    var square = new SvgSquare();
    //square.id = "square_0_0";
    //square.centerX = 50;
    //square.centerY = 50;
    square.width = 80;
    square.height = 80;
    //square.strokeWidth = 5;
    square.stroke = "magenta";
    //square.fill = "none";
    //square.opacity = 1.0;
    square.location = tile;
    square.target = gameBoardName;

    // Draw Object
    square.draw();
}

function drawSvgDisallow(refRectangleName) {

}

function drawSvgCircle(tile) {
    // Initialize Object
    var circle = new SvgCircle();
    //circle.id = "";
    //circle.centerX = 50;
    //circle.centerY = 50;
    circle.radius = 40;
    //circle.strokeWidth = 5;
    circle.stroke = "blue";
    //circle.fill = "none";
    //circle.opacity = 1.0;
    circle.location = tile;
    circle.target = gameBoardName;

    // Draw Object
    circle.draw();
}

function drawSvgCross(tile) {
    // Initialize Object
    var cross = new SvgCross();
    //cross.id = tile;
    //cross.centerX = 150;
    //cross.centerY = 50;
    cross.radius = 40;
    //cross.strokeWidth = 5;
    cross.stroke = "red";
    cross.strokeLinecap = "butt";
    //cross.fill = "none";
    //cross.opacity = 1.0;
    cross.location = tile;
    cross.target = gameBoardName;

    // Draw Object
    cross.draw();
}

function drawSvgRadialLine(tile, endpointTile) {
    // Initialize Object
    var radialLine = new SvgRadialLine();
    //radialLine.id = tile;
    //radialLine.centerX = 150;
    //radialLine.centerY = 150;
    //radialLine.radius = 180;
    radialLine.radius = 40;
    //radialLine.angle = angle;
    radialLine.offsetAngle = -5;
    radialLine.strokeWidth = 15;
    radialLine.stroke = "purple";
    radialLine.strokeLinecap = "round";
    //radialLine.fill = "none";
    radialLine.opacity = 0.5;
    radialLine.location = tile;
    radialLine.endpoint = endpointTile;
    radialLine.target = gameBoardName;

    // Draw Object
    radialLine.draw();
}
// #endregion

