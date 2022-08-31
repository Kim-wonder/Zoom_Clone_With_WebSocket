import express from 'express';
import req from 'express/lib/request';
import http from 'http';
import WebSocket from 'ws';


const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get('/', (_, res) => res.render("home"));
// app.get('/*', (_,res) => res.redirext("/*"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);

    socket["nickname"] = "anonymous"

    console.log("브라우저와 연결되었습니다.");

    socket.on("close", () => {
        console.log("브라우저와; 연결이 종료되었습니다.");
    });

    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}:: ${message.payload}`));
            break
            case "nickname":
                socket["nickname"] = message.payload;
        }
    });
});

server.listen(3000,handleListen);

