# Просьбы

## На ws.onmessage данные:

```json
{x:1, y:1, playerState:false, username:"Dima"}
```
```json
{x:10, y:17, playerState:true, username:"IamSmiley"}
```
```json
{x:49.5, y:48.5, playerState:false, username:"mMeneske"}
```

### При отключении игрока

```json
{playerState:disconnected, username: "Iamabot"}
```


## В начале игры мы вам на ws.send:

```json
{x:49.5, y:48.5 username:"mMeneske"}
```

## На ws.send далее:

```json
{x:14, y:1, username:"mMeneske"}
```

Int: x и y

String username и playerState