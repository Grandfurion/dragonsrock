class GameObject{
    constructor(x, y, width, height, color){
        this.x = x;  //STARTING AND CURRING COORDINATES
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}

var canvas = document.getElementById('game_canvas');
var ctx = canvas.getContext("2d");
canvas.height = 600;
canvas.width = 1000;

var player = new GameObject(canvas.width/2, canvas.height/2 - 50, 40, 50, "#06942c");
var foreground = [];
    // SCENE PROPERTIES
    var groundHeight = 80
    var skyColor = "#45d9cc";

foreground.push(new GameObject(0, canvas.height - groundHeight, canvas.width, groundHeight, "#5c2b03"));
//foreground.push(new GameObject(10, 40, 20, 20, "#FFFFFF"));
foreground.push(new GameObject(canvas.width/4*3, 400, 120, 120, "#000000"));
foreground.push(new GameObject(0, 200, 60, 4, "#5c2b03"));
foreground.push(new GameObject(90, 300, 60, 4, "#5c2b03"));
foreground.push(new GameObject(480, 400, 70, 4, "#5c2b03"));


foreground.push(new GameObject(0, 0, 2, canvas.height, "#000000"));
foreground.push(new GameObject(canvas.width-2, 0, 2, canvas.height, "#000000"));

    // CHARACTER PROPERTIES
var isGrounded = false;
var velocityY = -3;
var velocityX = 0;
var readyToJump = false;
var charImg = document.getElementById("mage");
var charImg_flip = document.getElementById("mage_flipped");
var imgToDraw = charImg;

    // BINDING KEY LISTENERS
var isJumping = false;
var goingRight = false;
var goingLeft = false;

document.addEventListener('keydown', keyPressed);
function keyPressed(e){
    if((e.code == "Space" || e.key == "w") && readyToJump == true){
        isJumping = true;
    }
    if(e.key == "d"){
        //velocityX += 0.8;
        goingRight = true;
        imgToDraw = charImg;
    }
    if(e.key == "a"){
        //velocityX -= 0.8;
        goingLeft = true;
        imgToDraw = charImg_flip;
    }
}

document.addEventListener('keyup', keyReleased);
function keyReleased(e){
    if(e.key == "d"){
        goingRight = false;
    }
    if(e.key == "a"){
        goingLeft = false;
    }
}

function drawScene(){
    ctx.fillStyle = skyColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    foreground.forEach(element => {
        ctx.fillStyle = element.color;
        ctx.fillRect(element.x, element.y, element.width, element.height);
    });
}

function drawCharacter(){
    /*ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);*/
    ctx.drawImage(imgToDraw, player.x, player.y, player.width, player.height);
}


var standsOn;
function checkCollision(){
    isGrounded = false;
    var vX;
    var vY;
    foreground.forEach(element => {
        vX = (player.x + (player.width/2)) - (element.x + (element.width/2));
        vY = (player.y + (player.height/2)) - (element.y + (element.height/2));

        var hWidths = (player.width/2) + (element.width/2);
        var hHeights = (player.height/2) + (element.height/2);
        var colDir = null;

        // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX);
        var oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                player.y += oY;
            } else {
                colDir = "b";
                player.y -= oY;
                isGrounded = true;
                 readyToJump = true;
            }
        } else {
                if (vX > 0) {
                    colDir = "l";
                    player.x += oX;
                } else {
                    colDir = "r";
                    player.x -= oX;
                }
            }
        }
        return colDir;

    });
}

function update(){

    // MOVING
    if(goingRight && !goingLeft){
        velocityX = 6;
    }

    if(goingLeft  && !goingRight){
        velocityX = -6;
    }

    // GROUND-JUMP CHECK
    var colDir = checkCollision();
    if(colDir == "l" || colDir == "r"){
        player.velocityX = 0;
    }
    else if(colDir == "t"){
        player.velocityY *= -1;
    }
    if(isGrounded){
        velocityY = 0;
        //player.y = canvas.height - standsOn.height - player.height - groundHeight;
    }else{
        velocityY += 0.25;
    }
    if(readyToJump && isJumping){
        velocityY -= 10;
        isJumping = false;
        readyToJump = false;
    }
    

    // FRICTION
    if(velocityX > 0) velocityX -= 0.3;
    if(velocityX < 0) velocityX += 0.3;
    if(velocityX < 0.3 && velocityX > -0.3) velocityX = 0;

    player.x += velocityX;
    player.y += velocityY;
    drawScene();
    drawCharacter();

    requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
/* MAKE EVERY CURVE ON THE MAP AS AN OBJECT OF CLASS "MAP OBJECT" WITH COORDINATES AND TYPE (VIA BOOL) IS IT
   FOREGROUND OR BACKGROUND, SO SHALL WE COUNT COLLAPSING IN IT AS COLLISION OR NO, CHECHING PLAYER WITH EVERY OBJECT ON MAP. */ 