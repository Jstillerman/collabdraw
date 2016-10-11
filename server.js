var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var express = require("express");
server.listen(8001);


app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

app.use(express.static("."))

app.get('/identity', function(req, res){
	res.json(getNewIdentity());
});

app.get('/clear', function(req, res){
	lines = []; //clear canvas
	zoom = {zoom: 1,index: -1,maxIndex: 1} //Reset zooming
	io.emit('delete'); //Tell clients to clear
	res.redirect("/");
});

lines = [];
zoom = {
	zoom: 1,
	index: -1,
	maxIndex: 1
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
	zoom.index ++;
	if(zoom.index == zoom.maxIndex){
		zoom.zoom*=2;
		zoom.maxIndex = zoom.zoom * zoom.zoom;
		zoom.index = 0;
	}
	console.log("Assigned zoom", zoom);
	return zoom;
}
