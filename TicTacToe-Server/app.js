
// #region GLOBAL VARIABLES
'use strict';
var http = require('http');
var port = process.env.PORT || 1337;

//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n' + res.connection.localPort);
//}).listen(port);

var express = require('express');
var app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);

var maxPlayerCount = 2;
var playerCount = 0;

var playerOne = "circle";
var playerTwo = "cross";

var victory = false;

var players = {}; // JSON (i.e. key="circle" or "cross", value="John")
var history = {}; // JSON (i.e. key="tile_0_1", value="circle")
// #endregion


// #region APP SETUP
app.use(express.static(__dirname + '/TicTacToe-Client'));

app.get('/', function (req, res) {
    //res.writeHead(200, { 'Content-Type': 'text/plain' });
    //res.end('Hello World\n' + res.connection.localPort);

    res.sendfile(__dirname + '/TicTacToe-Client/index.html');
});
// #endregion


// #region SOCKETS
///////////////////////////////////////////////////////////////////////////////
///                                 SOCKETS                                 ///
///////////////////////////////////////////////////////////////////////////////

io.sockets.on('connection', function (socket) {
    socket.on('adduser', function (username) {
        playerCount = Object.keys(players).length;

        if (playerCount < maxPlayerCount) {
            switch (playerCount) {
                case 0:
                    socket.gamePiece = playerOne;
                    players[socket.gamePiece] = username;
                    break;

                case 1:
                    socket.gamePiece = playerTwo;
                    players[socket.gamePiece] = username;
                    break;

                default:
            }

            socket.emit('updatechat', 'SERVER', 'You (' + username + ') have connected');
            socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
            io.sockets.emit('updateusers', players);
        }
    });

    socket.on('cleargame', function () {
        for (let elem in history) {
            delete history[elem];
        }

        victory = false;

        io.sockets.emit('cleargameboard');
    });

    socket.on('sendchat', function (data, marker) {
        console.log('user: ' + socket.gamePiece + ', ' + 'data: ' + data + ', ' + 'marker: ' + marker);
        // ex. user: circle, data: tile_0_0, marker: circle

        io.sockets.emit('updatechat', socket.gamePiece, data);
    });

    socket.on('clickTile', function (tile) {
        var historyCount = Object.keys(history).length;
        var lastTileSelected = Object.keys(history)[historyCount - 1];
        var lastPlayer = history[lastTileSelected];
        var currentPlayer = socket.gamePiece; // "circle" or "cross"

        // Did anyone win?
        if (victory === false) {
            // Are there any game pieces on the board?
            if (historyCount > 0) {
                // Does an object ("circle" or "cross") already exist in the history array (i.e. duplicates)?
                if (history[tile] === undefined) {
                    // Determine last gamepiece to move
                    if (lastPlayer === playerOne) {
                        if (currentPlayer === playerOne) {
                            // Message: "Current move should be Player 2 (" + playerTwo + ")."
                            socket.emit('tileSelected', tile, "disallow");
                        } else if (currentPlayer === playerTwo) {
                            io.sockets.emit('crossSelected', tile);
                            history[tile] = currentPlayer; // ex. history["tile_0_2"] = "cross"
                            //checkVictory(history);
                            checkVictory();
                        } else {
                            // Error...
                        }
                    } else if (lastPlayer === playerTwo) {
                        if (currentPlayer === playerOne) {
                            io.sockets.emit('circleSelected', tile);
                            history[tile] = currentPlayer; // ex. history["tile_0_1"] = "circle"
                            //checkVictory(history);
                            checkVictory();
                        } else if (currentPlayer === playerTwo) {
                            // Message: "Current move should be Player 1 (" + playerOne + ")."
                            socket.emit('tileSelected', tile, "disallow");
                        } else {
                            // Error...
                        }
                    } else {
                        // Error...
                    }
                } else {
                    // Message: 'This tile has previously been selected.'
                    socket.emit('tileSelected', tile, "disallow");
                }
            } else {
                // First move of the game...
                if (currentPlayer === playerOne) {
                    io.sockets.emit('circleSelected', tile);
                    history[tile] = currentPlayer; // ex. history["tile_0_1"] = "circle"
                } else if (currentPlayer === playerTwo) {
                    // Message: "Player 1 (" + playerOne + ") goes first!"
                    socket.emit('tileSelected', tile, "disallow");
                } else {
                    // Error...
                }
            }
        }
    });

    socket.on('disconnect', function () {
        if (players[socket.gamePiece] !== undefined) {
            var disconnectedUser = players[socket.gamePiece];
            delete players[socket.gamePiece];
            io.sockets.emit('updateusers', players);
            socket.broadcast.emit('updatechat', 'SERVER', disconnectedUser + ' has disconnected');
        }
    });
});

server.listen(port);
console.log('Listening on port: ' + port);
// #endregion


// #region CHECK VICTORY
///////////////////////////////////////////////////////////////////////////////
///                              CHECK VICTORY                              ///
///////////////////////////////////////////////////////////////////////////////

function checkVictory() {
    var historyCount = Object.keys(history).length;
    var lastTileSelected = Object.keys(history)[historyCount - 1];
    var lastPlayer = history[lastTileSelected];
    var lineData = "";
    var objVictoryLine = "";
    var endGameData = "";

    // Check for victory (3 objects in a line)

    // Row 1
    lineData = history["tile_0_0"] + "," + history["tile_0_1"] + "," + history["tile_0_2"];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        //io.sockets.emit('victory', "row1");
        //objVictoryLine = { "name": "victoryStrikeThrough", "targetBoard": "svgGameBoard", "startRectangle": "tile_0_1", "endRectangle": "tile_0_2", "startAngle": 0, "offsetAngle": -5, "strokeWidth": 15, "stroke": "black", "strokeLinecap": "round", "fill": "none", "opacity": 1.0 };
        //io.sockets.emit('victory', objVictoryLine);
        io.sockets.emit('victory', "tile_0_1", "tile_0_2");
        endGameData = { "winner": lastPlayer };
        io.sockets.emit('endgame', endGameData);
        victory = true;
    }

    // Row 2
    lineData = history["tile_1_0"] + "," + history["tile_1_1"] + "," + history["tile_1_2"];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        //io.sockets.emit('victory', "row2");
        //objVictoryLine = { "name": "victoryStrikeThrough", "targetBoard": "svgGameBoard", "startRectangle": "tile_1_1", "endRectangle": "tile_1_2", "startAngle": 0, "offsetAngle": -5, "strokeWidth": 15, "stroke": "black", "strokeLinecap": "round", "fill": "none", "opacity": 1.0 };
        //io.sockets.emit('victory', objVictoryLine);
        io.sockets.emit('victory', "tile_1_1", "tile_1_2");
        endGameData = { "winner": lastPlayer };
        io.sockets.emit('endgame', endGameData);
        victory = true;
    }

    // Row 3
    lineData = history["tile_2_0"] + "," + history["tile_2_1"] + "," + history["tile_2_2"];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        //io.sockets.emit('victory', "row3");
        //objVictoryLine = { "name": "victoryStrikeThrough", "targetBoard": "svgGameBoard", "startRectangle": "tile_2_1", "endRectangle": "tile_2_2", "startAngle": 0, "offsetAngle": -5, "strokeWidth": 15, "stroke": "black", "strokeLinecap": "round", "fill": "none", "opacity": 1.0 };
        //io.sockets.emit('victory', objVictoryLine);
        io.sockets.emit('victory', "tile_2_1", "tile_2_2");
        endGameData = { "winner": lastPlayer };
        io.sockets.emit('endgame', endGameData);
        victory = true;
    }

    // Column 1
    lineData = history["tile_0_0"] + "," + history["tile_1_0"] + "," + history["tile_2_0"];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        //io.sockets.emit('victory', "column1");
        //objVictoryLine = { "name": "victoryStrikeThrough", "targetBoard": "svgGameBoard", "startRectangle": "tile_1_0", "endRectangle": "tile_2_0", "startAngle": 90, "offsetAngle": -5, "strokeWidth": 15, "stroke": "black", "strokeLinecap": "round", "fill": "none", "opacity": 1.0 };
        //io.sockets.emit('victory', objVictoryLine);
        io.sockets.emit('victory', "tile_1_0", "tile_2_0");
        endGameData = { "winner": lastPlayer };
        io.sockets.emit('endgame', endGameData);
        victory = true;
    }

    // Column 2
    lineData = history["tile_0_1"] + "," + history["tile_1_1"] + "," + history["tile_2_1"];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        //io.sockets.emit('victory', "column2");
        //objVictoryLine = { "name": "victoryStrikeThrough", "targetBoard": "svgGameBoard", "startRectangle": "tile_1_1", "endRectangle": "tile_2_1", "startAngle": 90, "offsetAngle": -5, "strokeWidth": 15, "stroke": "black", "strokeLinecap": "round", "fill": "none", "opacity": 1.0 };
        //io.sockets.emit('victory', objVictoryLine);
        io.sockets.emit('victory', "tile_1_1", "tile_2_1");
        endGameData = { "winner": lastPlayer };
        io.sockets.emit('endgame', endGameData);
        victory = true;
    }

    // Column 3
    lineData = history["tile_0_2"] + "," + history["tile_1_2"] + "," + history["tile_2_2"];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        //io.sockets.emit('victory', "column3");
        //objVictoryLine = { "name": "victoryStrikeThrough", "targetBoard": "svgGameBoard", "startRectangle": "tile_1_2", "endRectangle": "tile_2_2", "startAngle": 90, "offsetAngle": -5, "strokeWidth": 15, "stroke": "black", "strokeLinecap": "round", "fill": "none", "opacity": 1.0 };
        //io.sockets.emit('victory', objVictoryLine);
        io.sockets.emit('victory', "tile_1_2", "tile_2_2");
        endGameData = { "winner": lastPlayer };
        io.sockets.emit('endgame', endGameData);
        victory = true;
    }

    // "Backslash" Diagonal ("\")
    lineData = history["tile_0_0"] + "," + history["tile_1_1"] + "," + history["tile_2_2"];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        //io.sockets.emit('victory', "backSlash");
        //objVictoryLine = { "name": "victoryStrikeThrough", "targetBoard": "svgGameBoard", "startRectangle": "tile_1_1", "endRectangle": "tile_2_2", "startAngle": 45, "offsetAngle": -5, "strokeWidth": 15, "stroke": "black", "strokeLinecap": "round", "fill": "none", "opacity": 1.0 };
        //io.sockets.emit('victory', objVictoryLine);
        io.sockets.emit('victory', "tile_1_1", "tile_2_2");
        endGameData = { "winner": lastPlayer };
        io.sockets.emit('endgame', endGameData);
        victory = true;
    }

    // "Forward Slash" Diagonal ("/")
    lineData = history["tile_0_2"] + "," + history["tile_1_1"] + "," + history["tile_2_0"];
    if (lineData === "circle,circle,circle" || lineData === "cross,cross,cross") {
        //io.sockets.emit('victory', "forwardSlash");
        //objVictoryLine = { "name": "victoryStrikeThrough", "targetBoard": "svgGameBoard", "startRectangle": "tile_1_1", "endRectangle": "tile_2_0", "startAngle": 135, "offsetAngle": -5, "strokeWidth": 15, "stroke": "black", "strokeLinecap": "round", "fill": "none", "opacity": 1.0 };
        //io.sockets.emit('victory', objVictoryLine);
        io.sockets.emit('victory', "tile_1_1", "tile_2_0");
        endGameData = { "winner": lastPlayer };
        io.sockets.emit('endgame', endGameData);
        victory = true;
    }
}
// #endregion

