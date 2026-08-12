let player;
let text;
let lab_boxes;
let playerStatus;
let playerNicnames;
let otherNicknames = [];
let lastServerUpdate;
let lastTickMoment;
let frezeTime;
let tick_length;
let lagConsequence;
let timeStamp;
let time;
let currentDate = new Date;

let lastHunter = false;
let phoneMode = true;
let mouseMovment = false;
let allowMovment = true;
const debugEnabled = false;

let BgColor = 0x00FFFF;
const gameScale = 50;
const serverUpdateFrequency = 0.05;
const defaultSpd = 0.15;
const nickSize = 0.4;
const nickDist = 0.8;
const frezeLength = 5;
const bugFix = 30;
const renderDesync = {x:0.5, y:0.5};
let currentScreenStartPos = {x:0, y:0};
let mouse = {x:0, y:0};
let extraPos = {x:0, y:0};

let lab;
async function loadFile() {
    const response = await fetch("../assets/lab.json");
    lab = await response.json();  
}
loadFile();


let currentSize = {width:document.documentElement.clientWidth, height:document.documentElement.clientHeight};


let game = new ScratchGame(currentSize.width, currentSize.height);
game.preload = preload;
game.create = create;
game.update = update;

function preload() {
    game.loadSpritesheet('box', 'assets/box.png', 20, 20);
    game.loadSpritesheet('player', 'assets/ballz.png', 200, 200);
}

function create() {
    game.setBackgroundColor(BgColor);
    
    player = game.createSprite(currentSize.width / 2, currentSize.height / 2, 'player');
    player.visible = true;
    player.size = gameScale / 200;

    lab_boxes = initPlane(-10000, -10000, 40, 40, Math.ceil(currentSize.width / gameScale * 0.75), Math.ceil(currentSize.height / gameScale * 0.75), "box");

    otherPlayers = initClones(-100, -1000, 'player');
    otherPlayers.clones[0].visible = false;
    otherPlayers.clones[0].size = gameScale / 200;

    text = this.createText(200, 50, "");
    text.makeXYCentred();
    text.font = 'Arial bold';
    text.color = '#000000';
    text.size = 20;
    text.visible = debugEnabled;
    
    playerStatus = this.createText(currentSize.width / 2, 30, "");
    playerStatus.makeXYCentred();
    playerStatus.font = 'Arial bold';
    playerStatus.color = '#FF0000';
    playerStatus.size = 50;

    playerNickname = this.createText(currentSize.width / 2, currentSize.height / 2 - nickDist * gameScale, currentUser.username);
    playerNickname.makeXYCentred();
    playerNickname.font = 'Arial bold';
    playerNickname.size = nickSize * gameScale;
    playerNickname.color = '#FF0000';
    playerNickname.bringToFront();

    wallDebug = initDebug(debugEnabled,debugEnabled,debugEnabled,debugEnabled);
    boxDebug = initDebug(debugEnabled,debugEnabled,debugEnabled,debugEnabled);
    timeTest = initDebug(debugEnabled,debugEnabled,debugEnabled,debugEnabled);
    costumeDebug = initDebug(debugEnabled,debugEnabled,debugEnabled,debugEnabled);

    extraPos.x = pos.x;
    extraPos.y = pos.y;
}
function update() {
    currentDate = new Date;
    time = currentDate.getTime();

    disableConsoleCheats();
    lag_test();

    mouseUpdates();
    playerUpdates();

    lab_boxes.runAll(positionboxes);

    otherPlayers.createClones(otherUsers.length - otherPlayers.amount(), 0);
    otherPlayers.runAll(positionclones);
    otherPlayers.runAll(positionnicks);

    text.text = 'X: ' + pos.x + '\nY: ' + pos.y + '\nTPS: ' + tps;
    playerStatus.text = `${(currentUser.isHunter)? "Status: Hunter" : "Status: Runner"}`;
}

function mouseUpdates() {
    if (game.isMouseDown() && phoneMode && allowMovment) {
        mouse.x = game.mouseX / gameScale - player.x / gameScale + pos.x;
        mouse.y = game.mouseY / gameScale - player.y / gameScale + pos.y;
        mouseMovment = true;
    }
}

function playerUpdates() {
    let freezeMovment = false;

    if(lastHunter == false && currentUser.isHunter == true){
        frezeTime = time + frezeLength * 1000;
    }
    if(frezeTime > time) {
        freezeMovment = true;
        mouseMovment = false;
    }
    lastHunter = currentUser.isHunter;


    if(allowMovment && !freezeMovment){
        let hasMoved = false;
        let overrideAutoMovement = game.isKeyDown('W') || game.isKeyDown('A') || game.isKeyDown('S') || game.isKeyDown('D') || game.isKeyDown('UP') || game.isKeyDown('LEFT') || game.isKeyDown('DOWN') || game.isKeyDown('RIGHT');
        if (game.isKeyDown('W') || game.isKeyDown('UP') || (pos.y - mouse.y > 0 && mouseMovment && !overrideAutoMovement)) {
            if(defaultSpd / lagConsequence < 2){
                pos.y -= defaultSpd / lagConsequence;
                pos.y = Math.floor(pos.y * 100) / 100;
                while (lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1 || lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1) {
                    pos.y += 0.01;
                }
            } else {
                for(let i = 0; i < defaultSpd / lagConsequence; i += 0.01){
                    pos.y -= 0.01;
                    if (lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1 || lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1) {
                        pos.y += 0.01;
                    }
                }
            }
            wallDebug.log(lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1, "1");
            pos.y = Math.floor(pos.y * 100) / 100;
            hasMoved = true;
        }
        if (game.isKeyDown('S') || game.isKeyDown('DOWN')  || (pos.y - mouse.y < 0 && mouseMovment && !overrideAutoMovement)) {
            if(defaultSpd / lagConsequence < 2){
                pos.y += defaultSpd / lagConsequence;
                pos.y = Math.ceil(pos.y * 100) / 100;
                while (lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1 || lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1) {
                    pos.y -= 0.01;
                }
            } else {
                for(let i = 0; i < defaultSpd / lagConsequence; i += 0.01){
                    pos.y += 0.01;
                    if (lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1 || lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1) {
                        pos.y -= 0.01;
                    }
                }
            }
            wallDebug.log(lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1, "2");
            pos.y = Math.floor(pos.y * 100) / 100;
            hasMoved = true;
        }
        if (game.isKeyDown('D') || game.isKeyDown('RIGHT')  || (pos.x - mouse.x < 0 && mouseMovment && !overrideAutoMovement)) {
            if(defaultSpd / lagConsequence < 2){
                pos.x += defaultSpd / lagConsequence;
                pos.x = Math.ceil(pos.x * 100) / 100;
                while (lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1 || lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1) {
                    pos.x -= 0.01;
                }
            } else {
                for(let i = 0; i < defaultSpd / lagConsequence; i += 0.01){
                    pos.x += 0.01;
                    if (lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1 || lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1) {
                        pos.x -= 0.01;
                    }
                }
            }
            wallDebug.log(lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1, "3");
            pos.x = Math.ceil(pos.x * 100) / 100;
            hasMoved = true;
        }
        if (game.isKeyDown('A') || game.isKeyDown('LEFT')  || (pos.x - mouse.x > 0 && mouseMovment && !overrideAutoMovement)) {
            if(defaultSpd / lagConsequence < 2){
                pos.x -= defaultSpd / lagConsequence;
                pos.x = Math.floor(pos.x * 100) / 100;
                while (lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1 || lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1) {
                    pos.x += 0.01;
                }
            } else {
                for(let i = 0; i < defaultSpd / lagConsequence; i += 0.01){
                    pos.x -= 0.01;
                    if (lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1 || lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1) {
                        pos.x += 0.01;
                    }
                }
            }
            wallDebug.log(lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1, "4");
            pos.x = Math.floor(pos.x * 100) / 100;
            hasMoved = true;
        }

        if(pos.x < mouse.x + defaultSpd && pos.x > mouse.x - defaultSpd && pos.y < mouse.y + defaultSpd && pos.y > mouse.y - defaultSpd) {
            mouseMovment = false;
        }

        if(hasMoved) {
            if(time - lastServerUpdate > serverUpdateFrequency * 1000) {
                sendData(pos);
                lastServerUpdate = time;
            }
            lastTickMoment = true;
        } else {
            lastServerUpdate = time;
            if(lastTickMoment){
                sendData(pos);
            }
            lastTickMoment = false;

        }

    }

    if (currentUser.isHunter){
        player.costume = 0;
        costumeDebug.log("c0");
    } else if (freezeMovment) {
        player.costume = 3;
        costumeDebug.log("c3");
    } else {
        player.costume = 1;
        costumeDebug.log("c1");
    }
    player.bringToFront();

    currentScreenStartPos.x = Math.floor(pos.x / 2 - lab_boxes.plane.length / 2);
    currentScreenStartPos.y = Math.floor(pos.y / 2 - lab_boxes.plane[0].length / 2);

    if(timeStamp != time){
        localStorage.setItem("ban_time", timeStamp + bugFix * 60000);
        window.location.href = "/";
    }
    extraPos.x = pos.x;
    extraPos.y = pos.y;
}

function positionboxes(currentX, currentY) {
    let planeX = currentX + currentScreenStartPos.x;
    let planeY = currentY + currentScreenStartPos.y;
    lab_boxes.plane[currentX][currentY].x = player.x - pos.x * gameScale + planeX * gameScale * 2 + renderDesync.x * gameScale;
    lab_boxes.plane[currentX][currentY].y = player.y - pos.y * gameScale + planeY * gameScale * 2 + renderDesync.y * gameScale;
    if (planeY < 0 || planeY > 49 || planeX < 0 || planeX > 49) {
        lab_boxes.plane[currentX][currentY].visible = true;
    } else if (lab[planeY][planeX] == 0) {
        lab_boxes.plane[currentX][currentY].visible = false;
    } else {
        lab_boxes.plane[currentX][currentY].visible = true;
    }
    lab_boxes.plane[currentX][currentY].size = gameScale / 10;
}

function positionclones(clone) {
    if (otherUsers[clone].username !== undefined) {
        otherPlayers.clones[clone].x = player.x - (pos.x - otherUsers[clone].x) * gameScale;
        otherPlayers.clones[clone].y = player.y - (pos.y - otherUsers[clone].y) * gameScale;
        if (otherUsers[clone].isHunter){
            otherPlayers.clones[clone].costume = 0;
            costumeDebug.log("c0");
        } else {
            otherPlayers.clones[clone].costume = 1 + otherUsers[clone].onHold * 2;
            costumeDebug.log("c" + otherPlayers.clones[clone].costume);
        }
        otherPlayers.clones[clone].visible = true;
    } else {
        otherPlayers.clones[clone].x = -10000;
        otherPlayers.clones[clone].y = -10000;
        otherPlayers.clones[clone].visible = false;
    }
}

function positionnicks(clone) {
    if (otherNicknames[clone] != undefined) {
        otherNicknames[clone].destroy()
    }
    otherNicknames[clone] = game.createText(otherPlayers.clones[clone].x, otherPlayers.clones[clone].y - nickDist * gameScale, otherUsers[clone].username);
    otherNicknames[clone].makeXYCentred();
    otherNicknames[clone].font = 'Arial bold';
    otherNicknames[clone].size = nickSize * gameScale;
    otherNicknames[clone].color = '#FF0000';
}

function disableConsoleCheats() {
    timeStamp = time;
    if(extraPos.x != pos.x || extraPos.y != pos.y){
        window.location.href = "/";
        localStorage.setItem("ban_time", timeStamp + bugFix * 60000);
    }
    if(Number(localStorage.getItem("ban_time")) > timeStamp) {
        window.location.href = "/";
        localStorage.setItem("ban_time", timeStamp + bugFix * 14400000);
    }
}

let last_time = 0;
let tick_time = [];
let tick_avg = 0;
let tps = 0;

function lag_test() {
    tick_length = time - last_time;

    timeTest.log("Tick took: " + tick_length + " ms");
    tick_time[tick_time.length] = tick_length;
    tick_avg = 0;
    if (tick_time.length > 5000) {
        for(let i = tick_time.length - 5000; i < tick_time.length; ++i){
            tick_avg += tick_time[i];
        }
        tick_avg /= 5000;
    } else {
        for(let i = 1; i < tick_time.length; ++i){
            tick_avg += tick_time[i];
        }
        tick_avg /= tick_time.length - 1;
    }
    tps = Math.floor(1000 / tick_avg);

    last_time = time;

    lagConsequence = 100 / tick_length / 6;
}