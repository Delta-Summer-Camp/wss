let pos = {x:49.5, y:48.5};
let currentUser = {playerStatus:"", username:""};
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
    if(inputDataObject.length === undefined){
        if (inputDataObject.username == currentUser.username) {
            currentUser.playerStatus = inputDataObject.playerStatus;
            pos.x = inputDataObject.x;
            pos.y = inputDataObject.y;
        } else {
            let useId;
            for(let i = 0; i < otherUsers.length; ++i){
                if(otherUsers[i].username == inputDataObject.username){
                    useId = i;
                }
            }
            if(useId === undefined){
                useId = otherUsers.length;
            }
            if (inputDataObject.playerStatus == "disconnected"){
                otherUsers[useId] = {username: undefined};
            } else {
                otherUsers[useId] = inputDataObject;
            }
        }
    } else {
        for(let i = 0; i < inputDataObject.length; ++i){
            if (inputDataObject[i].username == currentUser.username) {
                currentUser.playerStatus = inputDataObject[i].playerStatus;
                pos.x = inputDataObject[i].x;
                pos.y = inputDataObject[i].y;
            } else {
                let useId;
                for(let a = 0; a < otherUsers.length; ++a){
                    if(otherUsers[a].username == inputDataObject[i].username){
                        useId = a;
                    }
                }
                if(useId === undefined){
                    useId = otherUsers[i].length;
                }
                if (inputDataObject[i].playerStatus == "disconnected"){
                    otherUsers[useId] = {username: undefined};
                } else {
                    otherUsers[useId] = inputDataObject;
                }
            }
        }
    }
}

//Output gets sent to ws.send
function sendData(position) {
    let outputData = {type: 'move',x:position.x, y:position.y, username:currentUser.username};
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
