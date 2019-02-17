const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 320;

var canvasElement = document.createElement("canvas");
var canvas = canvasElement.getContext("2d");
canvasElement.width = CANVAS_WIDTH;
canvasElement.height = CANVAS_HEIGHT;
document.body.appendChild(canvasElement);

console.log(canvas);
var FPS = 30;


var player = {
    color: "#00A",
    x: 220,
    y: 270,
    width: 32,
    height: 32,

    draw: function(){
        console.log("draw called!");
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    }
};

function draw(){
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    player.draw();
}


function update(){

}

// setInterval(function(){
//     update();
    
// }, 1000/FPS);
draw();
