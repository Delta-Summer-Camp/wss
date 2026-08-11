let pos = {x:49.5, y:48.5};
let currentUser = {isHunter:false, username:"YOU", playerId: undefined};
let otherUsers = [];

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
function sendData() {
    outputData = {x:pos.x, y:pos.y, username:currentUser.username, playerId: currentUser.playerId};
    //console.log(outputData);
    // transmit output data via vss
}

//Removes the player from /game.html(.php) if they are not connected to the server
function onDisconnect(){
    window.location.href = "/";
}

//Test data
arrangeData([
    {x:22.5, y:2.5, isHunter: false, username:"TheAvreageBot", playerId:0, onHold:true},
    {x:64.5, y:30.5, isHunter: true, username:"mMeneske", playerId:1, onHold:true},
    {x:40.5, y:38.5, isHunter: true, username:"10x Engineer", playerId:2, onHold:false},
    {x:49.5, y:48.5, isHunter: false, username:"YOU", playerId: 3}
]);


//arrangeData({x:49.5, y:47.5, isHunter:false, username:"YOU", playerId: 3});

//arrangeData({x:0, y:0, isHunter:false, username:undefined, playerId: 0});