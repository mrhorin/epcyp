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
      <table className="table-striped">
        <thead>
          <tr>
            <th className="channel-box-col1">チャンネル詳細</th>
            <th className="channel-box-col2">リスナー</th>
            <th className="channel-box-col3">bps</th>
          </tr>
        </thead>
        <tbody>
          {channelItems}
        </tbody>
      </table>
    )
  }

}
