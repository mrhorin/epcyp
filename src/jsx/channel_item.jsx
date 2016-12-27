import React from "react"

module.exports = class ChannelItem extends React.Component {

  render(){
    return(
      <tr>
        <td className="channel-item-col1">
          <div className="channel-item-name">{this.props.channel.name}</div>
          <div className="channel-item-genre">{this.props.channel.genre}</div>
          <div className="channel-item-detail">{this.props.channel.detail}</div>
        </td>
        <td className="channel-item-col2">
          <div className="channel-item-listener">{this.props.channel.listener}/{this.props.channel.relay}</div>
          <div className="channel-item-time">{this.props.channel.time}</div>
        </td>
        <td className="channel-item-col3">
          <div className="channel-item-bps">{this.props.channel.bps}</div>
          <div className="channel-item-format">{this.props.channel.format}</div>
        </td>
      </tr>
    )
  }

}
