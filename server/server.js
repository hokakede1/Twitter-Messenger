var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
const Twitter = require('twitter');
// var config = require('./config')
var port = 4040;
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var theData = false;

app.use(cors());
app.use(bodyParser.json());

var client = new Twitter({
      consumer_key: "PUT YOUR CONSUMMER KEY HERE",
      consumer_secret: "PUT YOUR COMSUMMER SECRET HERE",
      access_token_key: "PUT YOUR ACCESS TOKEN HERE",
      access_token_secret: "PUT YOUR TOKEN SECRET HERE"
    })



app.get("/get/userInfo/:id", (req, res) => {

  var params = {
    id: req.params.id
  }

  client.get("users/show",params, (err, tweet, response) => {
    if (err) {
      console.log("ERR:", err)
    } else {
      var body = tweet;
      var payload = {
        name: body.name,
        image: body.profile_image_url,
        screen_name: body.screen_name
      }

      res.status(200).send(payload)
    }
  });
})

app.get("/getback", (req, res) => {
    client.get("direct_messages/events/list", (err, tweet, response) => {
      if (err) {
        console.log("ERR:", err)
      } else {
        var obj = {}
        obj.response = JSON.parse(response.body);
        obj.tweet = tweet;
        theData = obj;
        res.status(200).send(obj);
      }
    });
})


app.post("/send/mess", (req, res) => {

  var params = {
    user_id: "824530640859131904",
    text: req.body.text
  }

  console.log(params)

  client.post("direct_messages/new",params, (err, tweet, response) => {
    if (err) {
      console.log("ERR:", err)
    } else {
      res.status(200).send("sent")
    }
  });
})


//SOCKET


// io.on('connection', function(socket){
//   var stream = client.stream('user', {track: 'javascript'}, (stream) => {
//     stream.on('data', function(event) {
//       // console.log(event && event.text);
//       if(event.direct_message !== undefined){
//         var newMessObj = {};
//         newMessObj.sender_id = event.direct_message.sender.id_str;
//         newMessObj.recipient_id = event.direct_message.recipient.id_str;
//         newMessObj.content = event.direct_message.text;
//         socket.emit('new_message', newMessObj)
//       }
//     });
//   });  
// })



server.listen(port, () => {
  console.log('your server is running on ' + port)
})