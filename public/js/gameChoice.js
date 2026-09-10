let currentUser = {playerStatus:"", username:"", gameId: ""};
let isPlayer = true;

const urlParams = new URLSearchParams(window.location.search);
const idValue = urlParams.get('game');

if (idValue === undefined) {
    window.location.href = "/";
}

currentUser.gameId = Number(idValue[idValue.length - 1]);

if (typeof currentUser.gameId !== "number" || isNaN(currentUser.gameId) || currentUser.gameId < 1 || currentUser.gameId > 2 || (idValue[0] !== "w" && idValue[0] !== "g")) {
    window.location.href = "/";
}

if (idValue[0] == "w") {
    isPlayer = false;
} else if (idValue[0] == "g") {
    isPlayer = true;
}
