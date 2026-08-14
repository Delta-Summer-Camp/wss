let pos = {x:49.5, y:48.5};
let currentUser = {playerStatus:"", username:"", playerId: undefined};
let otherUsers = [];
let wsConnected = false;

currentUser.username = localStorage.getItem("username");
const passwordHash = localStorage.getItem("passwordHash");

const ws = new WebSocket("wss://game26.delta.camp/server");

ws.onopen = () => {
    console.log("Wss connected!");
    wsConnected = true;
    let auth = {
	type: 'auth',
	username: currentUser.username,
	passwordHash: passwordHash
	};
	ws.send(JSON.stringify(auth));
}

ws.onmessage = (event) => {
  const incData = JSON.parse(event.data);
  arrangeData(incData);
}

ws.onerror = (error) => {
   console.log("Ws Error: ", error);
   //allowMovment = false;
}

ws.onclose = () => {
   onDisconnect();
   //allowMovment = false;
}


// Function that gets activated by ws.onmessage
function arrangeData(inputDataObject) {
    if (inputDataObject.length === undefined) {
        if (inputDataObject.username == currentUser.username) {
            currentUser.playerStatus = inputDataObject.playerStatus;
            currentUser.playerId = inputDataObject.playerId;
           // pos.x = inputDataObject.x;
            //pos.y = inputDataObject.y;
            otherUsers[inputDataObject.playerId] = {username: undefined};
        } else {
            if (inputDataObject.username === undefined || inputDataObject.playerStatus == "disconnected"){
                otherUsers[inputDataObject.playerId] = {username: undefined};
            } else {
                otherUsers[inputDataObject.playerId] = inputDataObject;
            }
        }
    } else {
        for(let i = 0; i < inputDataObject.length; ++i){
            if (inputDataObject[i].username == currentUser.username) {
                currentUser.playerStatus = inputDataObject[i].playerStatus;
                currentUser.playerId = inputDataObject[i].playerId;
              //  pos.x = inputDataObject[i].x;
               // pos.y = inputDataObject[i].y;
                otherUsers[inputDataObject[i].playerId] = {username: undefined}
            } else {
                if (inputDataObject[i].username === undefined || inputDataObject[i].playerStatus == "disconnected"){
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
    let outputData = {type: 'move',x:position.x, y:position.y, username:currentUser.username, playerId: currentUser.playerId};
    if(wsConnected){
        ws.send(JSON.stringify(outputData));
    } else {
        console.log("Wss not connected!");
    }
    //console.log(outputData);
    // transmit output data via vss
}

//Removes the player from /game.php(.php) if they are not connected to the server
function onDisconnect(){
    //window.location.href = "/";
}
