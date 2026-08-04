# Просьбы

## В начале игры на ws.onmessage массив с данными

```json
{isHunter:false, username:"mMeneske", playerId:3}
```

и

## На ws.onmessage данные:

```json
{x:1, y:1, isHunter:false, username:"Dima", playerId:1, onHold:false}
```
```json
{x:10, y:17, isHunter:true, username:"IamSmiley", playerId:2, onHold:true}
```
```json
{isHunter:false, username:"mMeneske"}
```


## В начале игры мы вам на ws.send:

```json
{x:14, y:1, username:"mMeneske"}
```

## На ws.send данные:

```json
{x:14, y:1, username:"mMeneske", playerId:3}
```

Int: x, y и playerId(все целоые болше 0)

String username

Bool isHunter и onHold

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
http://localhost:8080/public/