const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(3000, () => {
  console.log('> Websocket is listening at:', port);
});

var totalCount = 0;

io.on('connection', (socket) => {
  console.log('user connected');

  // user login
  socket.on('login', (obj) => {
    socket.username = obj.username;
    totalCount++;
    // echo globally (all clients) that a person has connected
    io.emit('user joined', {
      username: socket.username,
      totalCount: totalCount
    });
    console.log(obj.username + '加入了聊天室');
  });

  // user talk
  socket.on('message', (obj) => {
    // echo globally expect itself message
    socket.broadcast.emit('message', obj);
    console.log(obj.username+'说：'+obj.msg);
  });

  // user logout
  socket.on('disconnect', () => {
    if (socket.username === undefined) {
        console.log('user disconnect');
        return ;
    }
    // echo globally expect itself that this client has left
    totalCount--;
    socket.broadcast.emit('user left', {
      username: socket.username,
      totalCount: totalCount
    });
    console.log(socket.username + '离开了聊天室');
  });
});
