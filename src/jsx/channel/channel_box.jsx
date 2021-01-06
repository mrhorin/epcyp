import React from 'react'
import Config from 'electron-store'
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
          registerFavorite={this.registerFavorite} startRecord={this.props.startRecord} stopRecord={this.props.stopRecord} />
      )
    })
    return (
      <div className="channel-box">
        <div className="channel-box-header">
          <div className="channel-box-header-col1" onClick={() => this.onChangeSort("name")}>チャンネル名</div>
          <div className="channel-box-header-col2" onClick={() => this.onChangeSort("listener")}>リスナー</div>
          <div className="channel-box-header-col3" onClick={() => this.onChangeSort("kbps")}>kbps</div>
        </div>
        <div className="channel-box-body">
          {channelItems}
        </div>
      </div>
    )
  }

}
