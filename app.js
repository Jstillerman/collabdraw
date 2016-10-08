var ftch= require("./node_modules/whatwg-fetch/fetch.js");

fetch('/identity')
.then(function(response) {
	return response.json()
}).then(function(json) {
	console.log('got Identity', json);
	ident = json;
	zoom(ident.zoom.zoom);
}).catch(function(ex) {
	console.log('parsing failed', ex)
})
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var socket = io();

socket.on("changes", function(data){
	draw(data);
	lines.push(data);
});

var currentZoom = 1;
var shiftx = 0;
var shifty = 0;
var ident;

var mouse = {};
var lines =[];

var w = canvas.width;
var h = canvas.height;

var oldx = 0;
var oldy = 0;

var color = prompt();

ctx.fillStyle = "black";
ctx.fillRect(0,0,w,h);


canvas.addEventListener("mousedown", function(evt){
	oldx = (evt.clientX-canvas.offsetTop)/currentZoom - (w*(ident.zoom.index%2));
	oldy = (evt.clientY-canvas.offsetLeft)/currentZoom - (h*Math.floor(ident.zoom.index/2));
	mouse.down = true;
});
canvas.addEventListener("mouseup", function(){
	mouse.down = false;
});

canvas.addEventListener("mousemove", function(evt){
	if(mouse.down){
		setupDraw((evt.clientX-canvas.offsetTop)/currentZoom - (w*(ident.zoom.index%2)), (evt.clientY-canvas.offsetLeft)/currentZoom - (h*Math.floor(ident.zoom.index/2)), oldx, oldy, 5/currentZoom, color);
	}
});

function setupDraw(x, y, oldx, oldy, width, color){
	var args = {
		x: x,
		y: y,
		width: width,
		color: color,
		oldx: oldx,
		oldy: oldy
	}
	socket.emit("drawData", args);
	draw(args);
	lines.push(args);
}
function draw(args){
	ctx.strokeStyle = args.color || "red";
	ctx.lineWidth = (args.width || 1)*currentZoom;
	ctx.beginPath();
	ctx.moveTo(args.oldx*currentZoom-(w*(ident.zoom.index%2)), args.oldy*currentZoom-(h * Math.floor(ident.zoom.index/2)));
	ctx.lineTo(args.x*currentZoom - (w*(ident.zoom.index%2)), args.y*currentZoom-(h * Math.floor(ident.zoom.index/2)));
	ctx.stroke();
	oldx=args.x;
	oldy=args.y;
}

function zoom(x, index){
	var dx = (x-currentZoom)*100;
	for(var i = 0; i<dx; i++){
		setTimeout(function(){scale(1.01, 1.01)}, i*10);
	}


}

function scale(x, y){
	ctx.fillRect(0, 0, w, h);
	currentZoom += 0.01
		lines.forEach(function(line){
			draw(line);
		});
}

new Vue({
	el: "#myApp",
    data: {
	    count: 1,
    color: color
    },

    methods: {
	    setColor: function(theColor){
		    color = theColor;
	    }
    }
})
