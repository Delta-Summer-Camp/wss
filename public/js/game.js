let player;
let text;
let lab_boxes;

const currentSpd = 0.3;

const gameScale = 15;
let pos = {x:49, y:48};
let currentUser = {isHunter:true, username:"YOU"};
let otherUsers = [
    {x:22, y:2, isHunter: false, username:"TheAvreageBot", playerId:1, onHold:true},
    {x:64, y:30, isHunter: true, username:"mMeneske", playerId:2, onHold:true},
    {x:40, y:38, isHunter: false, username:"10x Engineer", playerId:3, onHold:false}
];


let lab;
async function loadFile() {
    const response = await fetch("../assets/lab.json");
    lab = await response.json();  
}
loadFile();


let currentSize = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };

let game = new ScratchGame(currentSize.width, currentSize.height);
game.preload = preload;
game.create = create;
game.update = update;

function preload() {
    game.loadSpritesheet('box', 'assets/box.png', 20, 20);
    game.loadSpritesheet('player', 'assets/ballz.png', 200, 200);
}

function create() {
    game.setBackgroundColor(0x00FFFF);

    player = game.createSprite(currentSize.width / 2, currentSize.height / 2, 'player');
    player.visible = true;
    player.size = gameScale / 200;

    lab_boxes = initPlane(-10000, -10000, 40, 40, lab[0].length, lab.length, "box");

    otherPlayers = initClones(-100, -1000, 'player');
    otherPlayers.clones[0].visible = false;
    otherPlayers.clones[0].size = gameScale / 200;

    text = this.createText(currentSize.width / 2, 20, "");
    text.color = '#000000';
    
    playerStatus = this.createText(200, 20, `${(currentUser.isHunter)? "Status: Hunter" : "Status: not a hunter"}`);
    playerStatus.color = '#FF0000'
    wallDebug = initDebug();
    boxDebug = initDebug();
    timeTest = initDebug();
    costumeDebug = initDebug();
}
function update() {
    playerUpdates();

    lab_boxes.runAll(positionboxes);

    otherPlayers.createClones(otherUsers.length - otherPlayers.amount() + 1, 0);
    otherPlayers.runAll(positionclones);

    lag_test();

    text.text = 'X: ' + pos.x + '\nY: ' + pos.y + '\nTPS: ' + tps;
    playerStatus.text = `${(currentUser.isHunter)? "Status: Hunter" : "Status: not a hunter"}`;
}

function playerUpdates() {
    if (game.isKeyDown('W') || game.isKeyDown('UP')) {
        pos.y -= currentSpd;
        while (lab[Math.round(pos.y/2)][Math.round(pos.x/2)] == 1) {
            pos.y += 0.1;
        }
        wallDebug.log(pos.x, pos.y, lab[Math.round(pos.y/2)][Math.round(pos.x/2)] == 1, "1");
        pos.y = Math.floor(pos.y * 10) / 10;
    }
    if (game.isKeyDown('S') || game.isKeyDown('DOWN')) {
        pos.y += currentSpd;
        while (lab[Math.round(pos.y/2)][Math.round(pos.x/2)] == 1) {
            pos.y -= 0.1;
        }
        wallDebug.log(pos.x, pos.y, lab[Math.round(pos.y/2)][Math.round(pos.x/2)] == 1, "2");
        pos.y = Math.floor(pos.y * 10) / 10;
    }
    if (game.isKeyDown('D') || game.isKeyDown('RIGHT')) {
        pos.x += currentSpd;
        while (lab[Math.round(pos.y/2)][Math.round(pos.x/2)] == 1) {
            pos.x -= 0.1;
        }
        wallDebug.log(pos.x, pos.y, lab[Math.round(pos.y/2)][Math.round(pos.x/2)] == 1, "3");
        pos.x = Math.floor(pos.x * 10) / 10;
    }
    if (game.isKeyDown('A') || game.isKeyDown('LEFT')) {
        pos.x -= currentSpd;
        while (lab[Math.round(pos.y/2)][Math.round(pos.x/2)] == 1) {
            pos.x += 0.1;
        }
        wallDebug.log(pos.x, pos.y, lab[Math.round(pos.y/2)][Math.round(pos.x/2)] == 1, "4");
        pos.x = Math.floor(pos.x * 10) / 10;
    }

    if (currentUser.isHunter){
        player.costume = 0;
        costumeDebug.log("c0");
    } else {
        player.costume = 1;
        costumeDebug.log("c1");
    }
}

function positionboxes(planeX, planeY) {
    lab_boxes.plane[planeX][planeY].x = player.x - pos.x * gameScale + planeX * gameScale * 2;
    lab_boxes.plane[planeX][planeY].y = player.y - pos.y * gameScale + planeY * gameScale * 2;
    if (lab[planeY][planeX] == 0) {
        lab_boxes.plane[planeX][planeY].visible = false;
    } else if (lab[planeY][planeX] == 0) {
        lab_boxes.plane[planeX][planeY].visible = true;
    }
    lab_boxes.plane[planeX][planeY].size = gameScale / 10;
}

function positionclones(clone) {
    if (clone != 0) {
        otherPlayers.clones[clone].x = player.x - (pos.x - otherUsers[clone - 1].x) * gameScale
        otherPlayers.clones[clone].y = player.y - (pos.y - otherUsers[clone - 1].y) * gameScale
        if (otherUsers[clone - 1].isHunter){
            otherPlayers.clones[clone].costume = 0 + otherUsers[clone - 1].onHold * 2;
            costumeDebug.log("c" + otherPlayers.clones[clone].costume);
        } else {
            otherPlayers.clones[clone].costume = 1 + otherUsers[clone - 1].onHold * 2;
            costumeDebug.log("c" + otherPlayers.clones[clone].costume);
        }
        otherPlayers.clones[clone].visible = true;
    }
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