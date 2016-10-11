var ftch = require("./node_modules/whatwg-fetch/fetch.js");

fetch('/identity')
.then(function(response) {
	return response.json()
}).then(function(json) {
	console.log('got Identity', json);
	ident = json;
	zoom(ident.zoom.zoom, ident.zoom.index);
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

var color = "white";

ctx.fillStyle = "black";
ctx.fillRect(0,0,w,h);

function getSize(){
	return vm.$data.size; //This fetches the size from Vue
}

canvas.addEventListener("mousedown", function(evt){
	oldx = (evt.clientX-canvas.offsetTop + shiftx)/currentZoom;
	oldy = (evt.clientY-canvas.offsetLeft + shifty)/currentZoom;
	mouse.down = true;
});
canvas.addEventListener("mouseup", function(){
	mouse.down = false;
});

canvas.addEventListener("mousemove", function(evt){
	if(mouse.down){
		setupDraw((evt.clientX-canvas.offsetTop + shiftx)/currentZoom, (evt.clientY-canvas.offsetLeft + shifty)/currentZoom, oldx, oldy, getSize()/currentZoom, color);
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
	ctx.fillStyle= args.color || "red";
	ctx.lineWidth = (args.width || 1)*currentZoom;
	ctx.beginPath();
	ctx.arc(args.x*currentZoom-shiftx, args.y*currentZoom-shifty, args.width*currentZoom, 0, 2*Math.PI, false);
	ctx.fill();
}

function zoom(z, index){
	var dz = (z-currentZoom)*100;
	for(var i = 0; i<dz; i++){
		setTimeout(function(){scale(1.01, 1.01)}, i*10);
	}
	for(var i = 0; i < w * (ident.zoom.index%2); i++){
		setTimeout(function(){pan(1, 0);}, i*10);
	}

	for(var i = 0; i < h* Math.floor(ident.zoom.index/2); i++){
		setTimeout(function(){pan(0, 1);}, i*10);
	}


}

function scale(x, y){
	ctx.fillRect(0, 0, w, h);
	currentZoom += 0.01
		lines.forEach(function(line){
			draw(line);
		});
}

function pan(x, y){
	ctx.fillRect(0, 0, w, h);
	shiftx += x;
	shifty += y;
	lines.forEach(function(line){
		draw(line);
	});
}

var vm = new Vue({
	el: "#myApp",
    data: {
	    count: 1,
    	color: color,
			size: 5
    },

    methods: {
	    setColor: function(theColor){
		    color = theColor;
	    },
			getInfo: function(){
				console.log(shiftx, shifty);
			}
    }
});
