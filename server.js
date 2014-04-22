//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var config = require('./config');
var mongoose = require('mongoose');
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');


//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = exports.router = express();

var server = http.createServer(router);
var io = socketio.listen(server);

console.log(JSON.stringify(router));
console.log(JSON.stringify(router.settings.env));

var routerConfigfunc = function(){
    
    console.log("app.config....");
    
    //var dbUrl = config.test;
 //...
 // set the 'dbUrl' to the mongodb url that corresponds to the
 // environment we are in
 //router.settings.env = 'testing';
 console.log("///////////////" + router.settings.env);
 router.set('dbUrl', config.db[router.settings.env]);
 // connect mongoose to the mongo dbUrl
 mongoose.connect(router.get('dbUrl'));}();

//... previous code

router.get('/', routes.index);
router.get('/users', user.list);

router.get('/add/:first/:second', function (req, res) {
 // convert the two values to floats and add them together
 var sum = parseFloat(req.params.first) + parseFloat(req.params.second);
 res.send(200, String(sum));
});

//... previous code

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
