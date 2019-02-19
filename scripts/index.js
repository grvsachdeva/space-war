const CANVAS_WIDTH = 600;  //480 old
const CANVAS_HEIGHT = 500; //320 old
var enemy2counter = 5;
var level = 0;
var FPS = 50;
var playerBullets = [];
var enemies = [];
var interval;
var partition = 300;
var enemyVelocity = 2;

function reset(){
    if(document.getElementById("restartButton") != undefined){
        var elem = document.getElementById("restartButton");
        elem.parentNode.removeChild(elem);
    }
    level = 1;
    playerBullets = [];
    enemies = [];
    enemy2counter = 5;
    player.lives = 3;
    player.score = 0;
    partition = 300;
    enemyVelocity = 2;

    interval = setInterval(function(){
        draw();
        update();
    }, 1000/FPS);
}

var canvasElement = document.createElement("canvas");
var canvas = canvasElement.getContext("2d");
canvasElement.width = CANVAS_WIDTH;
canvasElement.height = CANVAS_HEIGHT;
document.getElementById("maindiv").appendChild(canvasElement);

var player = {
    color: "#00A",
    x: 280,
    y: 450,
    width: 32,
    height: 32,
    score: 0,
    lives: 3,

    draw: function(){
        this.sprite.draw(canvas, this.x, this.y);
        // canvas.fillStyle = this.color;
        // canvas.fillRect(this.x, this.y, this.width, this.height);
    }
};

player.sprite = Sprite("player");

function Bullet(I){
    I.active = true;
    I.xVelocity = 0;
    I.yVelocity = -I.speed;
    I.width = 3;
    I.height = 3;
    I.color = "#000";
    I.sprite = Sprite("bullet_enemy");
    I.inBounds = function(){
        return (I.x >= 0 && I.x <= CANVAS_WIDTH) && (I.y >= 0 && I.y <= CANVAS_HEIGHT);
    };

    I.draw = function(){
        // canvas.beginPath();
        // canvas.arc(this.x, this.y, this.width, 0, 2 * Math.PI);

        // var grad = canvas.createRadialGradient(100,100,0,100,100,141.42);

        // grad.addColorStop(0, 'rgba(82,255,246,1)');
        // grad.addColorStop(1, 'rgba(0,128,128,1)');
        
        // canvas.setTransform(1,0,0,1,0,0);
        // canvas.fillStyle = grad;

        // // canvas.fillStyle = radial-gradient(#387989, #6dd5ed);
        // canvas.fill();
        this.sprite.draw(canvas, this.x, this.y);

    };

    I.update = function(){
        I.x += I.xVelocity;
        I.y += I.yVelocity;

        I.active = I.active && I.inBounds();
    };

    return I;
}

function Enemy(I){
    I = I || {};
    I.type = 1,
    I.active = true;
    I.age = Math.floor(Math.random() * 128);
    I.color = "#A2B";
    I.x = CANVAS_WIDTH/4 + Math.random() * CANVAS_WIDTH/2;
    I.y = 0;
    I.xVelocity = 0;
    I.yVelocity = enemyVelocity;
    I.width = 32;
    I.height = 32;
    I.sprite = Sprite("enemy");

    I.inBounds = function(){
        return (I.x >= 0 && I.x <= CANVAS_WIDTH) && (I.y >=0 && I.y <= CANVAS_HEIGHT);
    };

    I.draw = function(){
        // canvas.fillStyle = this.color;
        // canvas.fillRect(this.x, this.y, this.width, this.height);
        this.sprite.draw(canvas, this.x, this.y);
    };

    I.update = function(){
        I.x += I.xVelocity;
        I.y += I.yVelocity;

        I.xVelocity = 3 * Math.sin(I.age * Math.PI/64);
        I.age++;
        I.active = I.active && I.inBounds();

        if(I.inBounds() === false){
            player.lives--;
        }
    };

    I.explode = function(){
        Sound.play("explosion");
        this.active = false;
        // ToDo: Add an explosion graphic
    };

    return I;
}

function Enemy2(I){
    I = I || {};
    I.type = 2,
    I.active = true;
    I.age = Math.floor(Math.random() * 128);
    I.color = "#A2B";
    I.x = CANVAS_WIDTH/4 + Math.random() * CANVAS_WIDTH/2;
    I.y = 0;
    I.xVelocity = 0;
    I.yVelocity = enemyVelocity+1;
    I.width = 45;
    I.height = 45;
    I.sprite = Sprite("enemy2");

    I.inBounds = function(){
        return (I.x >= 0 && I.x <= CANVAS_WIDTH) && (I.y >=0 && I.y <= CANVAS_HEIGHT);
    };

    I.draw = function(){
        this.sprite.draw(canvas, this.x, this.y);
    };

    I.update = function(){

        I.x += I.xVelocity;
        I.y += I.yVelocity;

        I.xVelocity = 3 * Math.sin(I.age * Math.PI/64);
        I.age++;
        I.active = I.active && I.inBounds();

        if(I.inBounds() === false){
            player.lives--;
        }
    };

    I.explode = function(){
        Sound.play("explosion");
        this.active = false;
        // ToDo: Add an explosion graphic
    };

    return I;
}


function draw(){
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    player.draw();

    playerBullets.forEach(function(bullet){
        bullet.draw();
    });

    enemies.forEach(function(enemy){
        enemy.draw();
    });

  canvas.font = "900 28px Helvetica";
  canvas.fillStyle = "red";
//   canvas.textAlign = "left";
  canvas.fillText("Lives: " + player.lives, 30, 30);
  canvas.fillText("Score: " + player.score, 220 , 30);
  canvas.fillText("Level: " + level, 450, 30);
}

function update(){
    if(player.lives <= 0){
        gameOver();
    }

    var templevel = Math.floor(player.score/partition + 1);
    if(templevel > level){
        level = templevel;
        enemyVelocity++;
    }

    if(keydown.left){
        player.x -= 6;
    }
    
    if(keydown.right){
        player.x += 6;
    }

    if(keydown.space){
        player.shoot();
    }

    player.x = player.x.clamp(0, CANVAS_WIDTH - player.width);

    playerBullets.forEach(function(bullet){
        bullet.update();
    });

    playerBullets = playerBullets.filter(function(bullet){
        return bullet.active;
    });

    enemies.forEach(function(enemy){
        enemy.update();
    });

    enemies = enemies.filter(function(enemy){
        return enemy.active;
    });

    if(Math.random() < 0.1){
        enemies.push(Enemy());
        if(enemy2counter == 0){
            enemies.push(Enemy2());
            enemy2counter = 5;
        }else{
            enemy2counter--;
        }
    }
    handleCollisions();
}

player.shoot = function(){
    var bulletPosition = this.midpoint();
    Sound.play("shoot");

    playerBullets.push(Bullet({
        speed: 5,
        x: bulletPosition.x,
        y: bulletPosition.y
    }));
};

player.midpoint = function(){
    return {
        x: this.x + this.width/2,
        y: this.y + this.height/2
    }
};

player.explode = function(){
    this.active = false;

    //ToDO: Add the explosion graphic and end the game
};

function collides(a, b){
    return (a.x < b.x+b.width) &&  (a.x+a.width > b.x) &&
    (a.y < b.y+b.height) && (a.y+a.height>b.y);
}

function handleCollisions(){
    playerBullets.forEach(function(bullet){
        enemies.forEach(function(enemy){
            if(collides(bullet, enemy)){
                if(enemy.type === 2){
                    player.score += 20;
                }else{
                    player.score += 10;
                }

                enemy.explode();
                bullet.active = false;
            }
        });
    });

    enemies.forEach(function(enemy){
        if(collides(enemy, player)){
            player.lives = 0;
            enemy.explode();
            player.explode();
        }
    });

}

function gameOver(){
    var image = new Image();
    image.src = "./images/gameover.png";
    // image.width = 200;
    // image.height = 140;
    image.onload = function() {
        canvas.drawImage(image, 100,100, 400, 140);
    }
    Sound.play("GameOver");
    var restartButton = `<button id="restartButton" onclick="reset()"></button> `
    $("#maindiv").append(restartButton);
    clearInterval(interval);
}

reset();