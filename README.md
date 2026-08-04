# Просьбы

На ws.onmessage массив с данными:

```json
{x:1, y:1, isHunter:false, username:"Dima", playerId:1, onHold:false}
```
```json
{x:10, y:17, isHunter:true, username:"IamSmiley", playerId:2, onHold:true}
```
Int: x, y и playerId(все целоые болше 0)

String username

Bool isHunter и onHold

или

```json
{x:-1, y:-1, isHunter:true, username:"", playerId:3, onHold:false}
```

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