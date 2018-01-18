import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import axios from 'axios'


export default class ChatMessage extends Component {
  constructor(){
    super()
    this.state = {
      name: '',
      img: ''
    }
  }

  componentDidMount(){
    axios.get(`http://localhost:4040/get/userInfo/${this.props.sender_id}`)
    .then(res => {
      this.setState({
        name: res.data.name,
        img: res.data.image
      },() => {
          this.props.scrollToBottom()
      })
    })
  }



  render(){
    return (
      <div>
       <img src={`${this.state.img}`}/>
       <span>{this.state.name}</span>
       <span>{`: ${this.props.text}` }</span>
      </div>
    )
  }
}
