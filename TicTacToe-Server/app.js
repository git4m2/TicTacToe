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

var usernames = {}; // JSON

app.use(express.static(__dirname + '/TicTacToe-Client'));

app.get('/', function (req, res) {
    //res.writeHead(200, { 'Content-Type': 'text/plain' });
    //res.end('Hello World\n' + res.connection.localPort);

    res.sendfile(__dirname + '/TicTacToe-Client/index.html');
});

io.sockets.on('connection', function (socket) {
    socket.on('sendchat', function (data, marker) {
        console.log('user: ' + socket.username + ', ' + 'data: ' + data + ', ' + 'marker: ' + marker);
        // ex. user: John, data: square_0_0, marker: circle

        io.sockets.emit('updatechat', socket.username, data);
    });

    socket.on('adduser', function (username) {
        playerCount = Object.keys(usernames).length;

        if (playerCount < maxPlayerCount) {
            switch (playerCount) {
                case 0:
                    usernames[username] = "circle";
                    break;

                case 1:
                    usernames[username] = "cross";
                    break;

                default:
            }

            socket.username = username;
            socket.emit('updatechat', 'SERVER', 'You (' + username + ') have connected');
            socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
            io.sockets.emit('updateusers', usernames);
        }
    });

    socket.on('disconnect', function () {
        if (usernames[socket.username] !== undefined) {
            delete usernames[socket.username];
            io.sockets.emit('updateusers', usernames);
            socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        }
    });
});

server.listen(port);
console.log('Listening on port: ' + port);

