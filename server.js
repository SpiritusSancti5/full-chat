'use strict'

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongodb').MongoClient;

var port = process.env.PORT || 3000;

app.use('/', express.static(__dirname + '/page'));

var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/node_chat';

mongo.connect(url, function(err, db){
  var msgcollection = db.collection('chat messages');


  io.on('connection', function(socket){
    io.emit('user connect', 'a user connected');

    msgcollection.find().toArray().then(function(docs){
      socket.emit('chat history', docs);
    });

    socket.on('chat message', function(msg){
      msgcollection.insertOne({ text: msg }, function(err, res) {
        if (err) { console.warn(err.message); }
        else { console.log("chat message inserted into db: " + msg); }
      });

      socket.broadcast.emit('chat message', msg);
    });

    socket.on('disconnect', function(){
      socket.broadcast.emit('user connect', 'a user disconnected');
    });
  });

});

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/page/index.html');
// });


http.listen(port, function(){
  console.log("Listening on port: " + port);
});
