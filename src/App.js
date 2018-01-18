import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import ChatDisplay from './ChatDisplay';
import io from 'socket.io-client';
import conversation, { Conversation } from './Conversation';
const socket = io("http://localhost:4040/");


class App extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      uniqConversations: false,
      current: "",
    }
  }


  componentDidMount() {
    // axios.get(`http://localhost:4040/get/userInfo/824530640859131904`).then(res => {
    //   console.log(res)
    // })

    var allId = {}
    var arr = []
    axios.get("http://localhost:4040/getback")
      .then((res) => {
        var arr = res.data.tweet.events;
        arr.forEach((message) => {
          var { message_create: { sender_id, target: { recipient_id } } } = message;
          if (allId[`${sender_id}${recipient_id}`] === undefined &&
            allId[`${recipient_id}${sender_id}`] === undefined) {
            allId[`${sender_id}${recipient_id}`] = []
          }
        })
        // Pushing in the uniq converstation
        arr.forEach((message) => {
          var { message_create: { sender_id, target: { recipient_id } } } = message;
          if (allId[`${sender_id}${recipient_id}`] !== undefined) {
            allId[`${sender_id}${recipient_id}`] = [...allId[`${sender_id}${recipient_id}`], message]
          }
          if (allId[`${recipient_id}${sender_id}`] !== undefined) {
            allId[`${recipient_id}${sender_id}`] = [...allId[`${recipient_id}${sender_id}`], message]
          }
        })
        this.setState({
          data: arr,
          uniqConversations: allId,
          current: Object.keys(allId)[0]
        })
      })

      socket.on('new_message', (data) => {
        var { sender_id, recipient_id, content } = data        
        var mimicObj = {
          message_create: {
            sender_id: sender_id,
            message_data: {
              text: content
            }
          }
        }
        var optionOne = `${sender_id}${recipient_id}`;
        var optionTwo = `${recipient_id}${sender_id}`;

          if (allId[optionOne] !== undefined) {
            var mimicArr = [mimicObj, ...allId[optionOne]]
            allId[optionOne] = mimicArr;
          } else if (allId[optionTwo] !== undefined){
            var mimicArr = [mimicObj, ...allId[optionTwo]]
            allId[optionTwo] = mimicArr;
          } else {
            allId[optionOne] = [mimicObj];
          }

        this.setState({
          uniqConversations: allId
        })
      })
  }



  onChangeCurrent = (propName) => {
    this.setState({
      current: propName
    })
  }

  textSubmit = (e) => {
    if(e.which === 13){
      var payload = {
        text: this.refs.hello.value
      }
      axios.post("http://localhost:4040/send/mess", payload)
        .then(res => {
          this.refs.hello.value = ""
        })
        .catch(err => console.log(err))
    }
  }



  render() {
    var hello = [];
    for (var prop in this.state.uniqConversations) {
      
      var option1 = prop.slice(0,18);
      var option2 = prop.slice(18,36);
      var conversationName = option1 === "953020241839140864" ? option2 : option1
      
      var card = <Conversation 
                key={prop}
                sender_id={conversationName}
                onChangeCurrent={this.onChangeCurrent}
                propId={prop}
                />
      hello.push(card)
    }

    return (
      <div className="wrapper">
        <div className="conversations">
          {hello}
        </div>
        <div className="chat_box">
          <ChatDisplay
            conversation={this.state.uniqConversations ? this.state.uniqConversations[this.state.current] : []}
          />
          <textarea className="chat_text"
          ref="hello"
          onKeyPress={this.textSubmit}
          ></textarea>
        </div>
      </div>
    )
  }
}

export default App;
