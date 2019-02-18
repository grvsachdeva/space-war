const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 320;
var enemy2counter = 5;

var canvasElement = document.createElement("canvas");
var canvas = canvasElement.getContext("2d");
canvasElement.width = CANVAS_WIDTH;
canvasElement.height = CANVAS_HEIGHT;
document.body.appendChild(canvasElement);

var FPS = 30;
var playerBullets = [];
var enemies = [];

var player = {
    color: "#00A",
    x: 220,
    y: 270,
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
    
    I.inBounds = function(){
        return (I.x >= 0 && I.x <= CANVAS_WIDTH) && (I.y >= 0 && I.y <= CANVAS_HEIGHT);
    };

    I.draw = function(){
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
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
    I.yVelocity = 2;
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
    I.yVelocity = 3;
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

  canvas.font = "24px Helvetica";
  canvas.textAlign = "right";
  canvas.strokeText("Score: " + player.score, 400, 20);
  canvas.strokeText("Lives: " + player.lives, 80, 20);
}

function gameOver(){
    // var a = {
    // color: "#00A",
    // x: 100,
    // y: 100,
    //     width: 100,
    //     height: 100
    // }
    // // canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // a.sprite = Sprite("gameover");
    // a.sprite.draw(canvas, a.x, a.y);
    
    clearInterval(interval);
    alert("Game Over!");
}

function update(){
    if(player.lives <= 0){
        gameOver();
    }

    if(keydown.left){
        player.x -= 5;
    }
    
    if(keydown.right){
        player.x += 5;
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

var interval = setInterval(function(){
    draw();
    update();
}, 1000/FPS);

