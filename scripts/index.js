const CANVAS_WIDTH = 600;  //480 old
const CANVAS_HEIGHT = 500; //320 old
var enemy2counter = 5;
var level = 0;
var FPS = 50;
var playerBullets = [];
var enemies = [];
var explosions = [];
var interval;
var partition = 300;
var enemyVelocity = 2;

resources.load([
    'images/sprites.png'
]);
resources.onReady(start);

function start() {
    canvas.font = "800 80px Verdana";
    var gradient = canvas.createLinearGradient(0, 0, canvasElement.width, 0);
    gradient.addColorStop("0", " red");
    gradient.addColorStop("0.5", "yellow");
    gradient.addColorStop("1.0", "red");
    canvas.fillStyle = gradient;
    canvas.fillText("SPACE WAR", 60, 100);

    var playButton = `<button id="playButton" onclick="reset()"></button> `
    $("#maindiv").append(playButton);

    var image = new Image();
    image.src = "./images/space_bar.png";
    image.onload = function () {
        canvas.drawImage(image, 40, 378, 220, 48);
    }

    var image2 = new Image();
    image2.src = "./images/arrow_keys2.png";
    image2.onload = function () {
        canvas.drawImage(image2, 320, 330, 200, 100);
    }

    canvas.font = "800 25px Verdana";
    canvas.fillStyle = "yellow";
    canvas.fillText("Press SPACE to shoot", 30, 458);
    canvas.fillText("Press LEFT & RIGHT", 300, 458);
    canvas.fillText("arrow keys to move", 320, 480);

}

function reset() {
    Sound.reset();
    Sound.play("kick_shock");
    if (document.getElementById("restartButton") != undefined) {
        var elem = document.getElementById("restartButton");
        elem.parentNode.removeChild(elem);
    }

    if (document.getElementById("playButton") != undefined) {
        var elem = document.getElementById("playButton");
        elem.parentNode.removeChild(elem);
    }
    level = 1;
    playerBullets = [];
    enemies = [];
    explosions = [];
    enemy2counter = 5;
    player.lives = 3;
    player.score = 0;
    partition = 300;
    enemyVelocity = 2;
    player.x = 300;
    player.y = 440;

    interval = setInterval(function () {
        draw();
        update();
    }, 1000 / FPS);
}

var canvasElement = document.createElement("canvas");
var canvas = canvasElement.getContext("2d");
canvasElement.width = CANVAS_WIDTH;
canvasElement.height = CANVAS_HEIGHT;
document.getElementById("maindiv").appendChild(canvasElement);

var player = {
    color: "#00A",
    x: 440,
    y: 300,
    width: 60,
    height: 60,
    score: 0,
    lives: 3,

    draw: function () {
        this.sprite.draw(canvas, this.x, this.y);
    }
};

player.sprite = Sprite("player3");

function Bullet(I) {
    I.active = true;
    I.xVelocity = 0;
    I.yVelocity = -I.speed;
    I.width = 3;
    I.height = 3;
    I.color = "#000";
    I.sprite = Sprite("bullet_enemy");
    I.inBounds = function () {
        return (I.x >= 0 && I.x <= CANVAS_WIDTH) && (I.y >= 0 && I.y <= CANVAS_HEIGHT);
    };

    I.draw = function () {
        this.sprite.draw(canvas, this.x, this.y);
    };

    I.update = function () {
        I.x += I.xVelocity;
        I.y += I.yVelocity;

        I.active = I.active && I.inBounds();
    };

    return I;
}

function Enemy(I) {
    I = I || {};
    I.type = 1,
        I.active = true;
    I.age = Math.floor(Math.random() * 128);
    I.color = "#A2B";
    I.x = CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2;
    I.y = 0;
    I.xVelocity = 0;
    I.yVelocity = enemyVelocity;
    I.width = 50;
    I.height = 50;
    I.sprite = Sprite("enemy3");

    I.inBounds = function () {
        return (I.x >= 0 && I.x <= CANVAS_WIDTH) && (I.y >= 0 && I.y <= CANVAS_HEIGHT);
    };

    I.draw = function () {
        this.sprite.draw(canvas, this.x, this.y);
    };

    I.update = function () {
        I.x += I.xVelocity;
        I.y += I.yVelocity;

        I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);
        I.age++;
        I.active = I.active && I.inBounds();

        if (I.inBounds() === false) {
            player.lives--;
        }
    };

    I.explode = function () {
        Sound.play("explosion");
        this.active = false;

        explosions.push({
            pos: [I.x, I.y],
            sprite: new Sprite2('images/sprites.png',
                [0, 117],
                [39, 39],
                16,
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                null,
                true)
        });

    };

    return I;
}

function Enemy2(I) {
    I = I || {};
    I.type = 2,
        I.active = true;
    I.age = Math.floor(Math.random() * 128);
    I.color = "#A2B";
    I.x = CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2;
    I.y = 0;
    I.xVelocity = 0;
    I.yVelocity = enemyVelocity + 1;
    I.width = 60;
    I.height = 60;
    I.sprite = Sprite("enemy2");

    I.inBounds = function () {
        return (I.x >= 0 && I.x <= CANVAS_WIDTH) && (I.y >= 0 && I.y <= CANVAS_HEIGHT);
    };

    I.draw = function () {
        this.sprite.draw(canvas, this.x, this.y);
    };

    I.update = function () {

        I.x += I.xVelocity;
        I.y += I.yVelocity;

        I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);
        I.age++;
        I.active = I.active && I.inBounds();

        if (I.inBounds() === false) {
            player.lives--;
        }
    };

    I.explode = function () {
        Sound.play("explosion");
        this.active = false;

        explosions.push({
            pos: [I.x, I.y],
            sprite: new Sprite2('images/sprites.png',
                [0, 117],
                [39, 39],
                16,
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                null,
                true)
        });
    };

    return I;
}


function draw() {
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    player.draw();

    playerBullets.forEach(function (bullet) {
        bullet.draw();
    });

    enemies.forEach(function (enemy) {
        enemy.draw();
    });

    canvas.font = "900 28px Helvetica";
    canvas.fillStyle = "red";
    canvas.fillText("Lives: " + player.lives, 30, 30);
    canvas.fillText("Score: " + player.score, 220, 30);
    canvas.fillText("Level: " + level, 450, 30);

    renderEntities(explosions);
}

function update() {
    if (player.lives <= 0) {
        gameOver();
        Sound.stop("kick_shock");
    }

    var templevel = Math.floor(player.score / partition + 1);
    if (templevel > level) {
        level = templevel;
        enemyVelocity++;
    }

    if (keydown.left) {
        player.x -= 6;
    }

    if (keydown.right) {
        player.x += 6;
    }

    if (keydown.space) {
        player.shoot();
    }

    player.x = player.x.clamp(0, CANVAS_WIDTH - player.width);

    playerBullets.forEach(function (bullet) {
        bullet.update();
    });

    playerBullets = playerBullets.filter(function (bullet) {
        return bullet.active;
    });

    enemies.forEach(function (enemy) {
        enemy.update();
    });

    enemies = enemies.filter(function (enemy) {
        return enemy.active;
    });

    if (Math.random() < 0.1) {
        enemies.push(Enemy());
        if (enemy2counter == 0) {
            enemies.push(Enemy2());
            enemy2counter = 5;
        } else {
            enemy2counter--;
        }
    }
    handleCollisions();

    for (var i = 0; i < explosions.length; i++) {
        explosions[i].sprite.update(0.013);

        if (explosions[i].sprite.done) {
            explosions.splice(i, 1);
            i--;
        }
    }
}

player.shoot = function () {
    var bulletPosition = this.midpoint();
    Sound.play("shoot");

    playerBullets.push(Bullet({
        speed: 5,
        x: bulletPosition.x,
        y: bulletPosition.y
    }));
};

player.midpoint = function () {
    return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
    }
};

player.explode = function () {
    this.active = false;

    explosions.push({
        pos: [this.x, this.y],
        sprite: new Sprite2('images/sprites.png',
            [0, 117],
            [39, 39],
            16,
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            null,
            true)
    });
};

function collides(a, b) {
    return (a.x < b.x + b.width) && (a.x + a.width > b.x) &&
        (a.y < b.y + b.height) && (a.y + a.height > b.y);
}

function handleCollisions() {
    playerBullets.forEach(function (bullet) {
        enemies.forEach(function (enemy) {
            if (collides(bullet, enemy)) {
                if (enemy.type === 2) {
                    player.score += 20;
                } else {
                    player.score += 10;
                }

                enemy.explode();
                bullet.active = false;
            }
        });
    });

    enemies.forEach(function (enemy) {
        if (collides(enemy, player)) {
            player.lives = 0;
            enemy.explode();
            player.explode();
        }
    });

}

function renderEntities(list) {
    for (var i = 0; i < list.length; i++) {
        renderEntity(list[i]);
    }
}

function renderEntity(entity) {
    canvas.save();
    canvas.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(canvas);
    canvas.restore();
}


function gameOver() {
    var image = new Image();
    image.src = "./images/gameover.png";
    image.onload = function () {
        canvas.drawImage(image, 100, 100, 400, 140);
    }
    Sound.play("GameOver");

    canvas.font = "800 34px Verdana";
    canvas.fillStyle = "yellow";
    canvas.fillText("YOUR SCORE: " + player.score, 160, 300);

    var restartButton = `<button id="restartButton" onclick="reset()"></button> `
    $("#maindiv").append(restartButton);
    clearInterval(interval);
}
