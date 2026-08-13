const startPos = {x:49.5, y:48.5}
let pos = {x:startPos.x, y:startPos.y};
let currentUser = {isHunter:false, username:"", playerId: undefined};
let otherUsers = [];
let wsConnected = false;

currentUser.username = localStorage.getItem("username");

const ws = new WebSocket(
    "wss://game26.delta.camp/server"
);

ws.onopen = () => {
    console.log("Wss connected!");
    wsConnected = true;
}

ws.onmessage = (event) => {
  arrangeData(data.toString());
}

ws.onerror = (error) => {
   console.log("Ws Error: ", error);
   allowMovment = false;
}

ws.onclose = () => {
   onDisconnect();
   allowMovment = false;
}


// Function that gets activated by ws.onmessage
function arrangeData(inputDataObject) {
    if (inputDataObject.length === undefined) {
        if (inputDataObject.username == currentUser.username) {
            currentUser.isHunter = inputDataObject.isHunter;
            currentUser.playerId = inputDataObject.playerId;
            pos.x = inputDataObject.x;
            pos.y = inputDataObject.y;
            otherUsers[inputDataObject.playerId] = {username: undefined};
        } else {
            if (inputDataObject.username === undefined){
                otherUsers[inputDataObject.playerId] = {username: undefined};
            } else {
                otherUsers[inputDataObject.playerId] = inputDataObject;
            }
        }
    } else {
        for(let i = 0; i < inputDataObject.length; ++i){
            if (inputDataObject[i].username == currentUser.username) {
                currentUser.isHunter = inputDataObject[i].isHunter;
                currentUser.playerId = inputDataObject[i].playerId;
                pos.x = inputDataObject[i].x;
                pos.y = inputDataObject[i].y;
                otherUsers[inputDataObject[i].playerId] = {username: undefined}
            } else {
                if (inputDataObject[i].username === undefined){
                    otherUsers[inputDataObject[i].playerId] = {username: undefined}
                } else {
                    otherUsers[inputDataObject[i].playerId] = inputDataObject[i];
                }
            }
        }
    }
}

//Output gets sent to ws.send
function sendData(position) {
    let outputData = {x:position.x, y:position.y, username:currentUser.username, playerId: currentUser.playerId};
    if(wsConnected){
        ws.send(outputData);
    } else {
        console.log("Wss not connected!");
    }
    //console.log(outputData);
    // transmit output data via vss
}

//Removes the player from /game.html(.php) if they are not connected to the server
function onDisconnect(){
    //window.location.href = "/";
}