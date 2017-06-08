import React from 'react'
import Config from 'electron-config'
import _ from 'lodash'

import ChannelItem from 'jsx/channel/channel_item.jsx'

const config = new Config({
  defaults: {
    fontSize: 13
  }
})

module.exports = class ChannelBox extends React.Component {

  constructor(props){
    super(props)
    this.registFavorite = this.registFavorite.bind(this)
  }

  // ------------ ChannelItem ------------
  registFavorite(favoriteIndex, channelName){
    this.props.registFavorite(favoriteIndex, channelName)
  }

  render(){
    let channelItems = this.props.channels.map((channel) => {
      return (
        <ChannelItem
          key={channel.key} channel={channel} favorites={this.props.favorites} fontSize={config.get('fontSize')}
          registFavorite={this.registFavorite} />
      )
    })
    return(
      <table>
        <thead>
          <tr>
            <th className="channel-box-col1">チャンネル詳細</th>
            <th className="channel-box-col2">リスナー</th>
            <th className="channel-box-col3">kbps</th>
          </tr>
        </thead>
        <tbody>
          {channelItems}
        </tbody>
      </table>
    )
  }

}
