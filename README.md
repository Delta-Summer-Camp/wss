# Просьбы

## На ws.onmessage данные:

```json
{x:1, y:1, status:"hunter", username:"Dima", playerId:0}
```
```json
{x:10, y:17, status:"hunter", username:"IamSmiley", playerId:1}
```
```json
{x:49.5, y:48.5, status:"hunter", username:"mMeneske", playerId:2}
```

или
```json
[
{x:1, y:1, status:false, username:"Dima", playerId:0},
{x:10, y:17, status:"hunter", username:"IamSmiley", playerId:1},
{x:49.5, y:48.5, status:false, username:"mMeneske", playerId:2}
]
```

### При отключении игрока

```json
{status:"disconnected", username:"iAmAbot" playerId:3}
```


## В начале игры мы вам на ws.send:

```json
{x:49.5, y:48.5, username:"mMeneske", playerId:undefined}
```

## На ws.send далее:

```json
{x:14, y:1, username:"mMeneske", playerId:3}
```

Int: x, y и playerId(x и y болше 0 а playerId ещё и целое)(playerId задаётся сервером)

String username и status (задаётся сервером)