var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var express = require("express");
server.listen(80);


app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

app.use(express.static("."))

app.get('/identity', function(req, res){
	res.json(getNewIdentity());
});

app.get('/clear', function(req, res){
	lines = [];
	io.emit('delete');
	res.redirect("/");
});

lines = [];
zoom = {
	zoom: 0.5, //This will become 1 upon first visit
	index: 0
};

io.on('connection', function (socket) {
	lines.forEach(function(line, index){
		setTimeout(function(){
			socket.emit("changes", line);
		}, lines.indexOf(line)*2);

	});
	socket.on('drawData', function (data) {
		lines.push(data);
		socket.broadcast.emit("changes", data);
	});
});

function getNewIdentity(){
	return {
		randomNumber:  Math.random(),
		zoom: getNextZoom()
	}
}

function getNextZoom(){
	zoom.zoom*=2;
	console.log("Assigned zoom", zoom);
	return zoom;
}
