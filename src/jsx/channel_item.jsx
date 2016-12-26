import React from "react"

module.exports = class ChannelItem extends React.Component {

  render(){
    return(
      <li className="list-group-item channel-item">
        <div className="media-body">
          <div className="channel-item-name">{this.props.channel.name}</div>
          <div>
            <div className="channel-item-genre">{this.props.channel.genre}</div>
            <div className="channel-item-detail">{this.props.channel.detail}</div>
          </div>
        </div>
      </li>
    )
  }

}
