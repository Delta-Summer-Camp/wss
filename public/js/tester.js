let origin;
async function loadFile() {
    const response = await fetch("./js/game.js");
    origin = await response.text();  
}
loadFile();

let copy;
async function loadFile1() {
    const response = await fetch("./assets/game_copy.js");
    copy = await response.text();  
}
loadFile1();

function fileCorrect() {
    timeStamp = time;
    if(origin != copy){
        localStorage.setItem("ban_time", timeStamp + bugFix * 14400000);
        window.location.href = "/";
    }
}