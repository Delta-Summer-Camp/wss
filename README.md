# Просьбы

На ws.onmessage массив с данными:

```json
[{x:1,y:1,isHunter:false,username:"Dima",onHold:"false"},{x:10,y:17,isHunter:true,username:"IamSmiley",onHold:"true"}]
```
Int: x и y 

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