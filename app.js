var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var socket = io();

socket.on("changes", function(data){
	draw(data);
	lines.push(data);
});

var currentZoom = 1;

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
	oldx = (evt.clientX-canvas.offsetTop)/currentZoom;
	oldy = (evt.clientY-canvas.offsetLeft)/currentZoom;
	mouse.down = true;
});
canvas.addEventListener("mouseup", function(){
	mouse.down = false;
});

canvas.addEventListener("mousemove", function(evt){
	if(mouse.down){
		setupDraw((evt.clientX-canvas.offsetTop)/currentZoom, (evt.clientY-canvas.offsetLeft)/currentZoom, oldx, oldy, 5, color);
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
	ctx.moveTo(args.oldx*currentZoom, args.oldy*currentZoom);
	ctx.lineTo(args.x*currentZoom, args.y*currentZoom);
	ctx.stroke();
	oldx=args.x;
	oldy=args.y;
}

function zoom(x){
	var dx = (x-currentZoom)*100;
	for(var i = 0; i<dx; i++){
		setTimeout(function(){scale(1.01, 1.01)}, i*10);
	}


}

function scale(x, y){
	ctx.fillRect(0, 0, w, h);
	currentZoom += 0.02
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
