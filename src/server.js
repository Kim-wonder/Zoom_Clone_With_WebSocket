import express from 'express';
import req from 'express/lib/request';
import http from 'http';
import WebSocket from 'ws';

// express가 할 일은 별로 없다.
// view를 설정해주고 render 해주면 끝. 
// 나머지는 웹소켓 안에서 실시간으로 일어난다.

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get('/', (_, res) => res.render("home"));
// app.get('/*', (_,res) => res.redirext("/*"));

const handleListen = () => console.log("Listening on http://localhost:3000");
// app.listen(3000,handleListen);

//ws(webSocket)과 http(express)는 서로 다른 protocal이라 server를 따로 써야 한다.
//하지만 강의에서는 두개를 합칠 예정(같은 서버를 쓴다.) 
//그러려면 function을 추가해야 한다.
// app.listen(3000,handleListen); 이걸 다시 시작할 수 있는 function을 만들어 보자.

//이건 모든 node.js에 내장되어있는 http package
//import http from 'http';
//서버를 만들 수 있게 해준다.
//서버를 만들기 위해 createServer하려면 
//requestListener 경로가 있어야 한다. = app
const server = http.createServer(app);
//이로인해 웹소켓을 연결하기 위한 server를 준비완료함.
//이제 이 server에서 웹소켓을 만들 수 있게 된 것!
// app.listen 하기 전인데, 아직 서버에 access(접근)하지 못했는데
//이제는 server에 접속할 수 있다.


//import WebSocket from 'ws';
//이제 새로운 웹소켓 서버를 만들거임 (wss)
//아래 wss는 http로 동작되는 server라는 서버에 wss라는 웹소켓 서버를 돌리려고 하는 거
//굳이 http 서버와 함께 돌리지 않아도 됨

const wss = new WebSocket.Server({ server });

//const server = http.createServer(app); 우리는 서버를 만들고
//const wss = new WebSocket.Server({ server }); 그 서버를 웹소켓으로 감싸줌.
//이제 웹소켓을 통과해야 서버로 갈 수 있음.
// function handleConnection(socket) {
//     console.log(socket);
// }
// wss.on("connection", handleConnection)

const sockets = [];
//connection에 연결된 모든 브라우저들을 모아둔다.


//connection이 생겼을 때 socket으로 즉시 메시지를 send함. => 프론트(app.js)에서도 socket을 만들었다.
//connection 이벤트가 없어도 백과 프론트는 연결이 되지만
//이벤트가 없으면 백은 아무런 반응을 하지 않는다.
//이벤트 안에 있는 특정 소켓socket들은(소켓.on/소켓.send) 서버에 연결된 것이 아니라 소켓 자체에 연결된 것
//socket.on("message")는 소켓이! 메시지를 받았을 때 반응하는 이벤트임. (왜냐면 서버를 소켓이 감싸고 있기 때문)
wss.on("connection", (socket) => {
    sockets.push(socket);
    //1. 브라우저와 연결됐을 때
    console.log("브라우저와 연결되었습니다.");
    //3. 브라우저와 연결이 종료됐을 때
    socket.on("close", () => {
        console.log("브라우저와; 연결이 종료되었습니다.");
    });
//function onSocketClose() {
//  console.log("브라우저와 연결이 종료되었습니다.");
//} => 이렇게 선언 후
//socket.on("close", onSocketClose);
//라고 해도 된다.

    //4. 프론트가 보낸 메시지 받기
    //user가 보낸 메시지를 다시 보내주자!
    socket.on("message", (message) => {
        console.log(message.toString());
        // socket.send(message.toString());
        sockets.forEach(aSocket => aSocket.send(message.toString()));
    });
    
    // socket.on("message", (message) => {
    //     console.log(message.toString());
    // });
//function onSocketMessage() {
//  console.log(message.toString());
//} => 이렇게 선언 후
//socket.on("message", onSocketMessage);
//라고 해도 된다.
    //2. 백에서 브라우저로 메시지 보내기
    // socket.send("안녕!");
});

server.listen(3000,handleListen);

