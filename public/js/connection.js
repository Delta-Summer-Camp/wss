let pos = {x:49.5, y:48.5};
let currentUser = {isHunter:false, username:""};
let otherData = [];
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
   //onDisconnect();
   allowMovment = false;
}


// Function that gets activated by ws.onmessage
function arrangeData(inputDataObject) {
    if (inputDataObject.length === undefined) {
        if (inputDataObject.username == currentUser.username) {
            currentUser.isHunter = inputDataObject.isHunter;
            pos.x = inputDataObject.x;
            pos.y = inputDataObject.y;
        } else {
            if (inputDataObject.username === undefined){
                otherData[inputDataObject.username] = undefined;
            } else {
                otherData[inputDataObject.username] = inputDataObject;
            }
        }
    } else {
        inputDataObject.array.forEach(function () {
            if (inputDataObject[i].username == currentUser.username) {
                currentUser.isHunter = inputDataObject[i].isHunter;
                pos.x = inputDataObject[i].x;
                pos.y = inputDataObject[i].y;
            } else {
                if (inputDataObject[i].username === undefined){
                    otherData[inputDataObject[i].username] = undefined;
                } else {
                    otherData[inputDataObject[i].username] = inputDataObject[i];
                }
            }
        });
    }
}

//Output gets sent to ws.send
function sendData(position) {
    let outputData = {x:position.x, y:position.y, username:currentUser.username};
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
    window.location.href = "/";
}

arrangeData([
    {x:22.5, y:2.5, isHunter: false, username:"TheAvreageBot", playerId:0, onHold:true},
    {x:64.5, y:30.5, isHunter: true, username:"mMeneske", playerId:1, onHold:true},
    {x:40.5, y:38.5, isHunter: true, username:"10x Engineer", playerId:2, onHold:false},
    {x:49.5, y:48.5, isHunter: false, username:"YOU", playerId: 3}
]);