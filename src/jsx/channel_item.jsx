import React from "react"

module.exports = class ChannelItem extends React.Component {

  render(){
    return(
      <li className="channel-item">
        <div className="channel-item-name">{this.props.channel.name}</div>
        <div className="channel-item-genre">{this.props.channel.genre}</div>
      </li>
    )
  }

}
