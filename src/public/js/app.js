// 여기는 유저에게만 보여지는 page인데
// 뭔가 추가수정삭제 후 저장할 때마다 
// nodemon이 재시작 되고 있다. (이럼안돼!)
// nodemon이 server을 수정하거나
// 자바스크립트 파일이 수정될 때만 새로고침되면 좋겠어!
// 하지만 내가 직접 FE 자바스크립트를 수정할 때는 
// nodemon이 새로고침 안하면 좋겠어!
// 그래서 nodemon.json 파일에서 ignore를 정해줄거야
// "ignore": ["src/public/*"],
// 저장하고 이 페이지로 돌아와서 저장을 하려 해도 콘솔이 변화하지 않아! 새로고침되지 않으니까!!
// 하지만 server.js에서 저장을 하면 터미널이 움직이는 걸 볼 수 있다.

// alert('hello world!');


const socket = new WebSocket(`ws://${window.location.host}`)

//server에서 connection을 만들고 
//프론트에서도 socket을 만들었다.

//첫번째 연결 :: open (connection 되면 확인 가능)
socket.addEventListener("open", () => {
    console.log("서버와 연결되었습니다. :)");
});
//function handleOpen() {
//  console.log("서버와 연결되었습니다. :)");
//} => 이렇게 작성 후
//socket.addEventListener("open", handleOpen);
//라고 해도 된다.

//두번째 연결 :: message (message를 받을 때 마다 확인 가능)
socket.addEventListener("message", (message) => {
    console.log("새로운 메시지 :", message.data);
});
//function handleMessage() {
//  console.log("새로운 메시지 :", message.data);
//} => 이렇게 작성 후
//socket.addEventListener("message", handleMessage);
//라고 해도 된다.

//세번째 연결 :: close (server와 연결이 종료되었을 때 확인 가능)
socket.addEventListener("close", () => {
    console.log("서버와 연결이 종료되었습니다.");
});

// 4. 프론트가 백으로 메시지를 보내는 법
setTimeout(() => {
    socket.send("브라우저가 인사를 합니다 : 방가워!");
},5000);
