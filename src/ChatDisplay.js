import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import axios from 'axios'
import ChatMessage from './ChatMessage'


export class ChatDisplay extends Component {
  constructor(props){
    super(props)
    this.state = {
      chat: []
    }
  }

  componentDidMount(){
    this.scrollToBottom();
    var notRelated = [...this.props.conversation].reverse();
    this.setState({
      chat: notRelated
    }, () => {
    })
  }

  componentWillReceiveProps(nextProps){
    var newArr = [...nextProps.conversation].reverse();
    this.setState({
      chat: newArr
    }, () => {
      this.scrollToBottom();
    })
  }

  scrollToBottom = () => {
    const messagesContainer = ReactDOM.findDOMNode(this.messagesEnd);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};
  



  render() {
    // console.log("HEY MAN:", this.state)
    var chat = this.state.chat.map((item,index) => {
      var {message_create: {sender_id, message_data:{text}}} = item;
      return (
        <ChatMessage key={index} text={text} sender_id={sender_id} 
        scrollToBottom={this.scrollToBottom}/>
      )
    })
    return (
      <div className="chat_content" ref={(el) => {this.messagesEnd = el; }}>
        {chat}
      </div>
    )
  }
}





export default ChatDisplay
