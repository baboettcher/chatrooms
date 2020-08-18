var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

const port = 6600;

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

const getVisitors = () => {
  // object of connected sockets
  // { "12" : {}, "13""{}"}
  let clients = io.sockets.clients().connected;
  let sockets = Object.values(clients); // make array of values
  let users = sockets.map(s => s.user); // get the user from each
  return users;
};

// emit all connected users to all sockets
const emitVisitors = () => {
  io.emit("visitors", getVisitors());
};

io.on("connection", function (socket) {
  console.log(`user ${socket.id} CONNECTED!`);

  socket.on("new_visitor", user => {
    console.log("new_visitor", user);
    socket.user = user;
    emitVisitors();
  });

  socket.on("disconnect", function () {
    emitVisitors();
    console.log(`user ${socket.id} disconnected`);
  });
});

http.listen(port, function () {
  console.log(`listening on *:${port}`);
});
