// Key: ^ = spike, o = coin, # = block, - = nothing, F
let scene1 = [
    ['-','-','-','-','-','-','-','-','^','^','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','^','^','o','o','-','-','-','#','-','-','-','-','-','-','#','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','^','^','#','#','-','-','-','-','-','-','-','-','-','-','-','-','-','^','-','-','-','o'],
    ['-','-','-','^','-','-','-','-','^','^','-','-','-','-','-','-','-','-','-','','-','-','-','-','-','^','-','-','-','o'],
    ['-','-','-','^','-','-','-','-','^','^','-','-','-','-','-','-','-','-','-','#','-','-','-','-','-','^','-','-','-','-'],
    ['-','-','-','^','-','#','-','-','^','^','-','-','-','-','-','o','-','-','-','#','-','-','-','-','-','^','^','-','-','-'],
    ['-','-','-','^','-','^','-','-','-','-','-','-','#','-','-','#','-','-','-','#','-','-','-','-','-','^','^','F','F','F'],
    ['-','-','-','^','^','^','-','-','-','-','-','-','#','^','^','^','^','^','^','#','o','-','-','-','-','^','^','F','F','F'],
    ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
    ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#']
]

let blocks = [];
let coins = [];
let spikes = [];
let finish = [];

let finishCount = 0;

let playerX = 30;
let playerY = 199.8;
let speed = 5;
let score = 0;
let velocityY = 0;
let lives = 3;


function setup() {
    createCanvas(999,333);
    background(116, 245, 247);
    noStroke();
    ellipseMode(CORNER);
}


function draw() {
    
    blocks = [];
    coins = [];
    spikes = [];
    finish = [];
    finishCount = 0;
    background(116, 245, 247);
    renderScene(scene1);

    fill(220,220,220);
    stroke(220,220,220);
    text(`Score: ${sessionStorage.getItem(score)+score}`,30,30)
    text(`${lives} lives`,30,50);

    playerY += velocityY;

    fill(255, 131, 82);
    stroke(255, 131, 82);
    rect(playerX, playerY, 33.3, 33.3);

    coinCollision();
    spikeCollision();
    moveOn();

    if(keyIsDown(LEFT_ARROW)) {
        limits();
        playerX -= speed;
    } if (keyIsDown(RIGHT_ARROW)) {
        limits();
        playerX += speed;
    }
    if (keyIsDown(UP_ARROW)) {
        limits();
        if (velocityY == 0) {
            console.log('hi', velocityY)
            velocityY -= 15;
        } else {
            fall();
        }
    } if (!keyIsDown(UP_ARROW)) {
        limits();
        fall();
    }
    youLose();
}


function fall() {
    let fall = true;
        for (i = 0; i < blocks.length; i++) {
            let charOverBlock = (playerY < blocks[i].y) && (blocks[i].y - playerY <= 33.3);
            let charUnderBlock = (playerY > blocks[i].y) && (playerY - blocks[i].y <= 33.3);
            let charLeftOfBlock = (playerX < blocks[i].x) && (blocks[i].x - playerX < 33.3);
            let charRightOfBlock = (blocks[i].x < playerX) && (playerX - blocks[i].x < 33.3);

            let touchingBlock = (charOverBlock || charUnderBlock) && (charLeftOfBlock || charRightOfBlock);

            if (touchingBlock) {
                fall = false;
                velocityY = 0;

                if (charUnderBlock) {
                    playerY = blocks[i].y - 33.3;
                } 
                if (charOverBlock) {
                    playerY = blocks[i].y - 32;
                }
            }
        }
        if (fall) {
            velocityY += 2.5;
        }
}


function renderScene(scene) {
    
    for (let i = 0; i<scene.length; i++) {
        for (let j=0; j<scene[i].length; j++) {
            if (scene[i][j] == "#") {
                fill(110, 98, 79);
                stroke(110, 98, 79);
                rect(33.3*j, 33.3*i, 33.3,33.3);

                blocks.push({x:33.3*j, y:33.3*i})
            }
            if (scene[i][j] == "o") {
                console.log("in coin")
                fill(254, 255, 184);
                stroke(116, 245, 247);
                ellipse(33.3*j+5, 33.3*i+5, 25.3,25.3);
                

                coins.push({x:33.3*j, y:33.3*i, i: i, j:j})
            }
            if (scene[i][j] == "-") {
                fill(116, 245, 247);
                stroke(116, 245, 247);
                rect(33.3*j, 33.3*i, 33.3,33.3);
                
            }

            if (scene[i][j] == "^") {
                fill(255, 255, 255);
                stroke(255, 255, 255);
                rect(33.3*j, 33.3*i, 33.3,33.3);

                spikes.push({x:33.3*j, y:33.3*i});
            }

            if (scene[i][j] == "F") {
                if (finishCount % 2 == 1) {
                    fill(255, 255, 255);
                    stroke(255, 255, 255);
                } else {
                    fill(0, 0, 0);
                    stroke(0, 0, 0);
                }
                finishCount += 1;
                rect(33.3*j, 33.3*i, 33.3,33.3);

                finish.push({x:33.3*j, y:33.3*i});
            }
        }
    }
}


function coinCollision() {
    for (i = 0; i < coins.length; i++) {
        let charOverCoin = (playerY < coins[i].y) && (coins[i].y - playerY <= 50);
        let charUnderCoin = (playerY > coins[i].y) && (playerY - coins[i].y <= 33.3);
        let charLeftOfCoin = (playerX < coins[i].x) && (coins[i].x - playerX < 50);
        let charRightOfCoin = (coins[i].x < playerX) && (playerX - coins[i].x < 33.3);

        let touchingCoin = (charOverCoin || charUnderCoin) && (charLeftOfCoin || charRightOfCoin);

        if (touchingCoin) {
            score += 1;
            scene1[coins[i].i][coins[i].j] = "-"
            coins = coins.splice(i, 1);
            console.log('score', score)
        }
    }
}

function spikeCollision() {
    for (i = 0; i < spikes.length; i++) {
        let charOverSpike = (playerY < spikes[i].y) && (spikes[i].y - playerY <= 50);
        let charUnderSpike = (playerY > spikes[i].y) && (playerY - spikes[i].y <= 33.3);
        let charLeftOfSpike = (playerX < spikes[i].x) && (spikes[i].x - playerX < 50);
        let charRightOfSpike = (spikes[i].x < playerX) && (playerX - spikes[i].x < 33.3);

        let touchingSpike = (charOverSpike || charUnderSpike) && (charLeftOfSpike || charRightOfSpike);

        if (touchingSpike) {
            playerX = 30;
            playerY = 199.8;
            lives -= 1;
            
            console.log('hearts', lives)
        }
    }
    
}

function youLose() {
    if (lives <= 0) {
        sessionStorage.setItem("level", 'lose')
        window.location.replace("youLose.html");
    }
}

function moveOn() {
    for (i = 0; i < finish.length; i++) {
        let charOverFinish = (playerY < finish[i].y) && (finish[i].y - playerY <= 50);
        let charUnderFinish = (playerY > finish[i].y) && (playerY - finish[i].y <= 33.3);
        let charLeftOfFinish = (playerX < finish[i].x) && (finish[i].x - playerX < 50);
        let charRightOfFinish = (finish[i].x < playerX) && (playerX - finish[i].x < 33.3);

        let touchingFinish = (charOverFinish || charUnderFinish) && (charLeftOfFinish || charRightOfFinish);

        if (touchingFinish) {
            sessionStorage.setItem('score', score);
            sessionStorage.setItem("level", 'win')
            window.location.replace("youWin.html")
        }
    }
}

function limits() {
    if (playerX <=-50) {
        console.log('hi!!')
        playerX = -45;
    }
    if (playerX >= 999) {
        playerX = 994;
    }
    if (playerY >= 333) {
        playerY = 328;
    } 
    if (playerY <= -50) {
        playerY = -45;
    }
}



//YO GUYS HOW BIG IS THE SQUARE
// dimensions are 33.3 x 33.3   

// wait we gotta loop one sec

//we have to input the right and lefts of the square so when it touches coin we can do collision
// yeah we should but we gotta put something up there so uhhh lets just roll with it for now 
//so just for the presentation??

if (sessionStorage.getItem("level") != 3) {
    window.location.replace("index.html");
}
