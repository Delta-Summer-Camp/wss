let currentSize = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };

let game = new ScratchGame(currentSize.width, currentSize.height);
game.preload = preload;
game.create = create;
game.update = update;

function preload() {
    game.loadSpritesheet('test', 'assets/sea.jpg', 800, 600);
    game.loadSpritesheet('box', 'assets/box.png', 20, 20);
    game.loadSpritesheet('player', 'assets/ballz.png', 200, 200);
}


let player;
let text;
let lab_boxes;

const currentSpd = 0.3;
const gameScale = 50;

const lab = [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 0, 1], [1, 0, 0, 0, 1], [1, 0, 1, 1, 1], [1, 1, 1, 1, 1]];
let pos = { x: 1, y: 1 };
//let pos = {x: lab[0].length / 2, y: lab.length / 2};


function create() {
    game.setBackgroundColor(0xFFFFFF);

    player = game.createSprite(currentSize.width / 2, currentSize.height / 2, 'player');
    player.visible = true;
    player.size = gameScale / 200;

    lab_boxes = initPlane(-10000, -10000, 40, 40, lab[0].length, lab.length, "box");

    text = this.createText(currentSize.width / 2, 20, "");
    text.color = '#000000';

    wallDebug = initDebug(1)
}

function update() {
    if (game.isKeyDown('W') || game.isKeyDown('UP')) {
        pos.y -= currentSpd;
        while (lab[Math.floor(pos.y)][Math.floor(pos.x)] == 1) {
            pos.y += 0.1;
        }
        wallDebug.log(lab[Math.floor(pos.y)][Math.floor(pos.x)] == 1, "1");
        pos.y = Math.floor(pos.y * 10) / 10;
    }
    if (game.isKeyDown('S') || game.isKeyDown('DOWN')) {
        pos.y += currentSpd;
        while (lab[Math.ceil(pos.y)][Math.ceil(pos.x)] == 1) {
            pos.y -= 0.1;
        }
        wallDebug.log(lab[Math.ceil(pos.y)][Math.ceil(pos.x)] == 1, "2");
        pos.y = Math.ceil(pos.y * 10) / 10;
    }
    if (game.isKeyDown('D') || game.isKeyDown('RIGHT')) {
        pos.x += currentSpd;
        while (lab[Math.ceil(pos.y)][Math.ceil(pos.x)] == 1) {
            pos.x -= 0.1;
        }
        wallDebug.log(lab[Math.ceil(pos.y)][Math.ceil(pos.x)] == 1, "3");
        pos.x = Math.ceil(pos.x * 10) / 10;
    }
    if (game.isKeyDown('A') || game.isKeyDown('LEFT')) {
        pos.x -= currentSpd;
        while (lab[Math.floor(pos.y)][Math.floor(pos.x)] == 1) {
            pos.x += 0.1;
        }
        wallDebug.log(lab[Math.floor(pos.y)][Math.floor(pos.x)] == 1, "4");
        pos.x = Math.floor(pos.x * 10) / 10;
    }
    text.text = 'X: ' + pos.x + '\nY: ' + pos.y;


    lab_boxes.runAll(positionboxes);
}

function positionboxes(planeX, planeY) {
    lab_boxes.plane[planeX][planeY].x = player.x - pos.x * gameScale + planeX * gameScale;
    lab_boxes.plane[planeX][planeY].y = player.y - pos.y * gameScale + planeY * gameScale;
    if (lab[planeY][planeX] == 0) {
        lab_boxes.plane[planeX][planeY].visible = false;
    } else if (lab[planeY][planeX] == 0) {
        lab_boxes.plane[planeX][planeY].visible = true;
    }
    lab_boxes.plane[planeX][planeY].size = gameScale / 20;
}
const registration = document.getElementById('registration');
const login = document.getElementById('login');
const playScreen = document.getElementById('start-screen');
login.classList.remove('hidden');
registration.classList.add('hidden');
playScreen.classList.add('hidden');

function register() {

    login.classList.add('hidden');
    registration.classList.remove('hidden');

}
function startScreen() {
    login.classList.add('hidden');
    playScreen.classList.remove('hidden');

}

function startGame() {
    const startScreen = document.getElementById('start-screen');
    login.classList.add('hidden');
    registration.classList.add('hidden');
    startScreen.classList.add('hidden');
    isPlaying = true;
}