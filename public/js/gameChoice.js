const urlParams = new URLSearchParams(window.location.search);
const idValue = urlParams.get('game');

if (idValue === undefined) {
    window.location.href = "/";
}

let gameId = Number(idValue[idValue.length - 1]);
let isPlayer = true;

if (typeof gameId !== "number" || isNaN(gameId) || gameId < 1 || gameId > 2 || (idValue[0] !== "w" && idValue[0] !== "g")) {
    window.location.href = "/";
}

if (idValue[0] == "w") {
    isPlayer = false;
} else if (idValue[0] == "g") {
    isPlayer = true;
}
