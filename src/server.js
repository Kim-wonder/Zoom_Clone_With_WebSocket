import express from 'express';
import req from 'express/lib/request';

// express가 할 일은 별로 없다.
// view를 설정해주고 render 해주면 끝. 
// 나머지는 웹소켓 안에서 실시간으로 일어난다.

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get('/', (req, res) => res.render("home"));
app.get('/*', (req,res) => res.redirext("/*"));

const handleListen = () => console.log("Listening on http://localhost:3000");
app.listen(3000,handleListen);