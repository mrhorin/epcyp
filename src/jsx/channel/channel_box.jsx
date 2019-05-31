import React from 'react'
import Config from 'electron-config'
import _ from 'lodash'

import ChannelItem from 'jsx/channel/channel_item.jsx'

const config = new Config({
  defaults: {
    fontSize: 13
  }
})

export default class ChannelBox extends React.Component {

  constructor(props){
    super(props)
  }

  onChangeSort = (sortKey) => {
    this.props.changeSort(sortKey)
  }

  // ------------ ChannelItem ------------
  registerFavorite = (favoriteIndex, channelName) => {
    this.props.registerFavorite(favoriteIndex, channelName)
  }

  render(){
    let channelItems = this.props.channels.map((channel) => {
      return (
        <ChannelItem
          key={channel.key} channel={channel} favorites={this.props.favorites} fontSize={config.get('fontSize')}
          registerFavorite={this.registerFavorite} />
      )
    })
    return(
      <table>
        <thead>
          <tr>
            <th className="channel-box-col1" onClick={() => this.onChangeSort("name")}>チャンネル詳細</th>
            <th className="channel-box-col2" onClick={() => this.onChangeSort("listener")}>リスナー</th>
            <th className="channel-box-col3" onClick={() => this.onChangeSort("kbps")}>kbps</th>
          </tr>
        </thead>
        <tbody>
          {channelItems}
        </tbody>
      </table>
    )
  }

}
