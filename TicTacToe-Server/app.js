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

var players = {}; // JSON (i.e. key="circle"/"cross", value="John")

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
                    //players[username] = "circle";
                    //players["circle"] = username;
                    socket.gamePiece = "circle";
                    players[socket.gamePiece] = username;
                    break;

                case 1:
                    //players[username] = "cross";
                    //players["cross"] = username;
                    socket.gamePiece = "cross";
                    players[socket.gamePiece] = username;
                    break;

                default:
            }

            //socket.username = username;
            socket.emit('updatechat', 'SERVER', 'You (' + username + ') have connected');
            socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
            io.sockets.emit('updateusers', players);
        }
    });

    socket.on('sendchat', function (data, marker) {
        //console.log('user: ' + socket.username + ', ' + 'data: ' + data + ', ' + 'marker: ' + marker);
        console.log('user: ' + socket.gamePiece + ', ' + 'data: ' + data + ', ' + 'marker: ' + marker);
        // ex. user: John, data: square_0_0, marker: circle

        //io.sockets.emit('updatechat', socket.username, data);
        io.sockets.emit('updatechat', socket.gamePiece, data);
    });

    socket.on('disconnect', function () {
        //if (players[socket.username] !== undefined) {
        //    delete players[socket.username];
        //    io.sockets.emit('updateusers', players);
        //    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        //}

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

