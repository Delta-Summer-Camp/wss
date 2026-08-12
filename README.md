# Просьбы

## На ws.onmessage данные:

```json
{x:1, y:1, isHunter:false, username:"Dima", playerId:1, onHold:false}
```
```json
{x:10, y:17, isHunter:true, username:"IamSmiley", playerId:2, onHold:true}
```
```json
{x:49.5, y:48.5, isHunter:false, username:"mMeneske", playerId:4}
```

или
```json
[
{x:1, y:1, isHunter:false, username:"Dima", playerId:1, onHold:false},
{x:10, y:17, isHunter:true, username:"IamSmiley", playerId:2, onHold:true},
{x:49.5, y:48.5, isHunter:false, username:"mMeneske", playerId:4}
]
```

### При отключении игрока

```json
{username:undefined, playerId:1}
```


## В начале игры мы вам на ws.send:

```json
{x:14, y:1, username:"mMeneske", playerId:undefined}
```

## На ws.send далее:

```json
{x:14, y:1, username:"mMeneske", playerId:3}
```

Int: x, y и playerId(x и y болше 0 а playerId ещё и целое)

String username

Bool isHunter, inAnimation и onHold

# Внутреняя информация

To start server run:
```bash
python -m http.server 8080
```
или
```bash
npx http-server . -p 8080
```
Then join on:
http://localhost:8080/

## Чё надо сделать для настроек

 Контроль типа стен
 Mobile Mode
 