var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

app.use('/', express.static(__dirname + '/page'));

/* app.get('/', function(req, res){
  res.sendFile(__dirname + '/page/index.html');
}); */

io.on('connection', function(socket){
  io.emit('user connect', 'a user connected');

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    io.emit('user connect', 'a user disconnected');
  });
});


http.listen(port, function(){
  console.log("Listening on port: " + port);
});
