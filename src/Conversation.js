import React, { Component } from 'react'
import axios from 'axios'
export class Conversation extends Component {
  constructor(){
      super();
      this.state = {
        name: '',
        screen_name: ''
      }
  }

  componentDidMount(){
    axios.get(`http://localhost:4040/get/userInfo/${this.props.sender_id}`)
        .then(res => {
            this.setState({
                name: res.data.name,
                screen_name: res.data.screen_name
            })
        })
  }


  render() {
    return (
      <div className="conversation_card"
           onClick={() => this.props.onChangeCurrent(this.props.propId)}>
          <h6>{`${this.state.name} @${this.state.screen_name}`}</h6>
      </div>
    )
  }
}

export default Conversation
