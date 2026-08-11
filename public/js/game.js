let player;
let text;
let lab_boxes;
let playerStatus;
let playerNicnames;
let otherNicknames = [];
let lastServerUpdate;
let lastTickMoment;

let phoneMovment = true;
let mouseMovment = false;
let allowMovment = true;
const debugEnabled = false;

let BgColor = 0x00FFFF;
const serverUpdateFrequency = 0.05;
const currentSpd = 0.15;
const gameScale = 50;
const nickSize = 20;
const nickDist = 40;
const renderDesync = {x:0.5, y:0.5};
let mouse = {x:0, y:0};

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

    lab_boxes = initPlane(-10000, -10000, 40, 40, lab[0].length, lab.length, "box");

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

    playerNickname = this.createText(currentSize.width / 2, currentSize.height / 2 - nickDist, currentUser.username);
    playerNickname.makeXYCentred();
    playerNickname.font = 'Arial bold';
    playerNickname.size = nickSize;
    playerNickname.color = '#FF0000';
    playerNickname.bringToFront();

    wallDebug = initDebug(debugEnabled,debugEnabled,debugEnabled,debugEnabled);
    boxDebug = initDebug(debugEnabled,debugEnabled,debugEnabled,debugEnabled);
    timeTest = initDebug(debugEnabled,debugEnabled,debugEnabled,debugEnabled);
    costumeDebug = initDebug(debugEnabled,debugEnabled,debugEnabled,debugEnabled);
}
function update() {
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
    if (game.isMouseDown() && phoneMovment && allowMovment) {
        mouse.x = game.mouseX / gameScale - player.x / gameScale + pos.x;
        mouse.y = game.mouseY / gameScale - player.y / gameScale + pos.y;
        mouseMovment = true;
    }
}

function playerUpdates() {
    if(allowMovment){
        let hasMoved = false;
        let overrideAutoMovement = game.isKeyDown('W') || game.isKeyDown('A') || game.isKeyDown('S') || game.isKeyDown('D') || game.isKeyDown('UP') || game.isKeyDown('LEFT') || game.isKeyDown('DOWN') || game.isKeyDown('RIGHT');
        if (game.isKeyDown('W') || game.isKeyDown('UP') || (pos.y - mouse.y > 0 && mouseMovment && !overrideAutoMovement)) {
            pos.y -= currentSpd;
            while (lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1 || lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1) {
                pos.y += 0.01;
            }
            wallDebug.log(lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1, "1");
            pos.y = Math.floor(pos.y * 100) / 100;
            hasMoved = true;
        }
        if (game.isKeyDown('S') || game.isKeyDown('DOWN')  || (pos.y - mouse.y < 0 && mouseMovment && !overrideAutoMovement)) {
            pos.y += currentSpd;
            while (lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1 || lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1) {
                pos.y -= 0.01;
            }
            wallDebug.log(lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1, "2");
            pos.y = Math.floor(pos.y * 100) / 100;
            hasMoved = true;
        }
        if (game.isKeyDown('D') || game.isKeyDown('RIGHT')  || (pos.x - mouse.x < 0 && mouseMovment && !overrideAutoMovement)) {
            pos.x += currentSpd;
            while (lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1 || lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1) {
                pos.x -= 0.01;
            }
            wallDebug.log(lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.ceil(pos.x)/2)] == 1, "3");
            pos.x = Math.floor(pos.x * 100) / 100;
            hasMoved = true;
        }
        if (game.isKeyDown('A') || game.isKeyDown('LEFT')  || (pos.x - mouse.x > 0 && mouseMovment && !overrideAutoMovement)) {
            pos.x -= currentSpd;
            while (lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1 || lab[Math.floor(Math.ceil(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1) {
                pos.x += 0.01;
            }
            wallDebug.log(lab[Math.floor(Math.floor(pos.y)/2)][Math.floor(Math.floor(pos.x)/2)] == 1, "4");
            pos.x = Math.floor(pos.x * 100) / 100;
            hasMoved = true;
        }

        if(pos.x < mouse.x + currentSpd / 2 && pos.x > mouse.x - currentSpd / 2 && pos.y < mouse.y + currentSpd / 2 && pos.y > mouse.y - currentSpd / 2) {
            mouseMovment = false;
        }

        if(hasMoved) {
            const time = new Date;
            if(time.getTime() - lastServerUpdate > serverUpdateFrequency * 1000){
                sendData();
                lastServerUpdate = time.getTime();
            }
            lastTickMoment = true;
        } else {
            const time = new Date;
            lastServerUpdate = time.getTime();
            if(lastTickMoment){
                sendData();
            }
            lastTickMoment = false;

        }
    }

    if (currentUser.isHunter){
        player.costume = 0;
        costumeDebug.log("c0");
    } else {
        player.costume = 1;
        costumeDebug.log("c1");
    }
    player.bringToFront();
}

function positionboxes(planeX, planeY) {
    lab_boxes.plane[planeX][planeY].x = player.x - pos.x * gameScale + planeX * gameScale * 2 + renderDesync.x * gameScale;
    lab_boxes.plane[planeX][planeY].y = player.y - pos.y * gameScale + planeY * gameScale * 2 + renderDesync.y * gameScale;
    if (lab[planeY][planeX] == 0) {
        lab_boxes.plane[planeX][planeY].visible = false;
    } else if (lab[planeY][planeX] == 0) {
        lab_boxes.plane[planeX][planeY].visible = true;
    }
    lab_boxes.plane[planeX][planeY].size = gameScale / 10;
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
    otherNicknames[clone] = game.createText(otherPlayers.clones[clone].x, otherPlayers.clones[clone].y - nickDist, otherUsers[clone].username);
    otherNicknames[clone].makeXYCentred();
    otherNicknames[clone].font = 'Arial bold';
    otherNicknames[clone].size = nickSize;
    otherNicknames[clone].color = '#FF0000';
}

let last_time = 0;
let tick_time = [];
let tick_avg = 0;
let tps = 0;

function lag_test() {
    const d = new Date();
    let time = d.getTime();
    let late_time = time - last_time;

    timeTest.log("Tick took: " + late_time + " ms");
    tick_time[tick_time.length] = late_time;
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
}