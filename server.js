var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var express = require("express");
server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.use(express.static("."))

app.get('/clear', function(req, res){
  lines = [];
  io.emit('delete');
  res.redirect("/");
});

lines = [];

io.on('connection', function (socket) {
  lines.forEach(function(line, index){
    setTimeout(function(){
      socket.emit("changes", line);
    }, lines.indexOf(line)*2);

  });
  socket.on('drawData', function (data) {
    console.log(data);
    lines.push(data);
    socket.broadcast.emit("changes", data);
  });
});
