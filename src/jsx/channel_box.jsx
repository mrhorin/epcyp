import React from "react"
import ChannelItem from "jsx/channel_item.jsx"

module.exports = class ChannelBox extends React.Component {

  constructor(){
    super()
  }

  render(){
    var channelItems = this.props.channels.map((channel) => {
      return (
        <ChannelItem key={channel.key} channel={channel}/>
      )
    })
    return(
      <ul id="channel-box">
        {channelItems}
      </ul>
    )
  }

}
