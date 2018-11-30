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

var players = {}; // JSON (i.e. key="circle"/"cross", value="John")
var history = {}; // JSON (i.e. key="square_0_1", value="circle")

app.use(express.static(__dirname + '/TicTacToe-Client'));

app.get('/', function (req, res) {
    //res.writeHead(200, { 'Content-Type': 'text/plain' });
    //res.end('Hello World\n' + res.connection.localPort);

    res.sendfile(__dirname + '/TicTacToe-Client/index.html');
});

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

    socket.on('sendchat', function (data, marker) {
        console.log('user: ' + socket.gamePiece + ', ' + 'data: ' + data + ', ' + 'marker: ' + marker);
        // ex. user: circle, data: square_0_0, marker: circle

        io.sockets.emit('updatechat', socket.gamePiece, data);
    });

    socket.on('clickSquare', function (square) {
        var historyCount = Object.keys(history).length;
        var currentPlayer = socket.gamePiece; // "circle" or "cross"

        // Are there any game pieces on the board?
        if (historyCount > 0) {
            var lastSquareSelected = Object.keys(history)[historyCount - 1];
            var lastPlayer = history[lastSquareSelected];

            // Does an object ("circle" or "cross") already exist in the history array (i.e. duplicates)?
            if (history[square] === undefined) {
                // Determine last gamepiece to move
                if (lastPlayer === playerOne) {
                    if (currentPlayer === playerOne) {
                        // Message: "Current move should be Player 2 (" + playerTwo + ")."
                        socket.emit('squareSelected', square, "disallow");
                    } else if (currentPlayer === playerTwo) {
                        io.sockets.emit('squareSelected', square, currentPlayer);
                        history[square] = currentPlayer; // ex. history["square_0_2"] = "cross"
                    } else {
                        // Error...
                    }
                } else if (lastPlayer === playerTwo) {
                    if (currentPlayer === playerOne) {
                        io.sockets.emit('squareSelected', square, currentPlayer);
                        history[square] = currentPlayer; // ex. history["square_0_1"] = "circle"
                    } else if (currentPlayer === playerTwo) {
                        // Message: "Current move should be Player 1 (" + playerOne + ")."
                        socket.emit('squareSelected', square, "disallow");
                    } else {
                        // Error...
                    }
                } else {
                    // Error...
                }
            } else {
                // Message: 'This square has previously been selected.'
                socket.emit('squareSelected', square, "disallow");
            }
        } else {
            if (currentPlayer === playerOne) {
                io.sockets.emit('squareSelected', square, currentPlayer);
                history[square] = currentPlayer; // ex. history["square_0_1"] = "circle"
            } else if (currentPlayer === playerTwo) {
                // Message: "Player 1 (" + playerOne + ") goes first!"
                socket.emit('squareSelected', square, "disallow");
            } else {
                // Error...
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

