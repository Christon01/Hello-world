var LEFT_KEY = 37;
var UP_KEY = 38;
var RIGHT_KEY = 39;
var DOWN_KEY = 40;
var SPACE_KEY = 32;
var HERO_MOVEMENT = 5;

var lastLoopRun = 0;
var score = 0;
var iterations = 0;

var controller = new Object();

// tracking enemies

var enemies = new Array();

var playing = false;
var startButton

var Music;
var blastSound;
var startOverSound;
 
// sound location adding sound of laser, collision & start game

function loadSound() {
  blastSound = loadSound("www.http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/player_shoot.wav");
  startOverSound = loadSound("www.http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/explosion_02.wav")
  music = loadSound("www.http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3")
}

function music(){
  myMusic = new sound("gametheme.mp3");
    myMusic.play();
}

function createSprite(element, x, y, w, h) {
  var result = new Object();
  result.element = element;
  result.x = x;
  result.y = y;
  result.w = w;
  result.h = h;
  return result;
}

// pressing controller keys

function toggleKey(keyCode, isPressed) {
  if (keyCode == LEFT_KEY) {
    controller.left = isPressed;
  }
  if (keyCode == RIGHT_KEY) {
    controller.right = isPressed;
  }
  if (keyCode == UP_KEY) {
    controller.up = isPressed;
  }
  if (keyCode == DOWN_KEY) {
    controller.down = isPressed;
  }
  if (keyCode == SPACE_KEY) {
    //blastSound.play();
    controller.space = isPressed;
  }  
}

// setting hero & enemy collid

function intersects(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

//setting heros boundaries

function ensureBounds(sprite, ignoreY) {
  if (sprite.x < 20) {
    sprite.x = 20;
  }
  if (!ignoreY && sprite.y < 20) {
    sprite.y = 20;
  }
  if (sprite.x + sprite.w > 480) {
    sprite.x = 480 - sprite.w;
  }
  if (!ignoreY && sprite.y + sprite.h > 480) {
    sprite.y = 480 - sprite.h;
  }
}

// adding hero to game telling browser to get element

function setPosition(sprite) {
  var e = document.getElementById(sprite.element);
  e.style.left = sprite.x + 'px';
  e.style.top = sprite.y + 'px';
}

// controller key functions, moving hero

function handleControls() {
  if (controller.up) {
    hero.y -= HERO_MOVEMENT;
  }
  if (controller.down) {
    hero.y += HERO_MOVEMENT;
  }
  if (controller.left) {
    hero.x -= HERO_MOVEMENT;
  }
  if (controller.right) {
    hero.x += HERO_MOVEMENT;
  }
// controlling laser & hero also give laser time to continue off screen
  
  if (controller.space && laser.y <= -120) {
    //****blastSound.play();
    laser.x = hero.x + 9;
    laser.y = hero.y - laser.h;
  }
  
  ensureBounds(hero);
}

//setting laser & enemy collid 
//adding to score and removing enemy and laser from game
//also stopping enemy from going off screen of game

function checkCollisions() {
  for (var i = 0; i < enemies.length; i++) {
    if (intersects(laser, enemies[i])) {
      //****startOverSound.play();
      var element = document.getElementById(enemies[i].element);
      element.style.visibility = 'hidden';
      element.parentNode.removeChild(element);
      enemies.splice(i, 1);
      i--;
      laser.y = -laser.h;
      score += 100;
    } else if (intersects(hero, enemies[i])) {
      gameOver();
    } else if (enemies[i].y + enemies[i].h >= 500) {
      var element = document.getElementById(enemies[i].element);
      element.style.visibility = 'hidden';
      element.parentNode.removeChild(element);
      enemies.splice(i, 1);
      i--;
    }
  }
}
//game over
function gameOver() {
  var element = document.getElementById(hero.element);
  element.style.visibility = 'hidden';
  element = document.getElementById('gameover');
  element.style.visibility = 'visible';
}

//show hero & laser & set position

function showSprites() {
  setPosition(hero);
  setPosition(laser);
  for (var i = 0; i < enemies.length; i++) {
    setPosition(enemies[i]);
  }
  
//keeping score
  
  var scoreElement = document.getElementById('score');
  scoreElement.innerHTML = 'SCORE: ' + score;
}

// enemies movements

function updatePositions() {
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].y += 4;
    enemies[i].x += getRandom(7) - 3;
    ensureBounds(enemies[i], true);
  }
  laser.y -= 12;
}
 // enemys are randomly "name" inserted about every two seconds
//adding it to the HTML page

function addEnemy() {
  var interval = 50;
  if (iterations > 1500) {
    interval = 5;
  } else if (iterations > 1000) {
    interval = 20;
  } else if (iterations > 500) {
    interval = 35;
  }
  
  if (getRandom(interval) == 0) {
    var elementName = 'enemy' + getRandom(10000000);
    var enemy = createSprite(elementName, getRandom(450), -40, 35, 35);
    
    var element = document.createElement('img');
    element.id = enemy.element;
    element.className = 'enemy'; 
    element.src =  "http://4.bp.blogspot.com/-p577qzxT-nE/UdSJOGdzg7I/AAAAAAAAAuo/kFi522wZROI/s315/alien1.png"
    document.children[0].appendChild(element);
    
    enemies[enemies.length] = enemy;
  }
}

function getRandom(maxSize) {
  return parseInt(Math.random() * maxSize);
}

// running actions for game, making game run smooth

function loop() {
  if (new Date().getTime() - lastLoopRun > 40) {
    updatePositions();
    handleControls();
    checkCollisions();
    
    addEnemy();
    
    showSprites();
    
    lastLoopRun = new Date().getTime();
    iterations++;
  }
  setTimeout('loop();', 2);
}

document.onkeydown = function(evt) {
  toggleKey(evt.keyCode, true);
};

document.onkeyup = function(evt) {
  toggleKey(evt.keyCode, false);
};

//create hero & laser

var hero = createSprite('hero', 250, 460, 20, 20);
var laser = createSprite('laser', 0, -120, 2, 50);

loop();



