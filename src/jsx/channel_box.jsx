import React from 'react'
import ChannelItem from 'jsx/channel_item.jsx'

module.exports = class ChannelBox extends React.Component {

  constructor(props){
    super(props)
    this.registFavorite = this.registFavorite.bind(this)
  }

  // 昇順ソート
  sortASC(hash, key){
    hash.sort((a, b) =>{
      if(a[key] < b[key]) return -1;
      if(a[key] > b[key]) return 1;
      return 0;
    })
    return hash
  }

  // 降順ソート
  sortDESC(hash, key){
    hash.sort((a, b) =>{
      if(a[key] > b[key]) return -1;
      if(a[key] < b[key]) return 1;
      return 0;
    })
    return hash
  }

  // ------------ ChannelItem ------------
  registFavorite(favoriteIndex, channelName){
    this.props.registFavorite(favoriteIndex, channelName)
  }

  render(){
    let channels = this.sortDESC(this.props.channels, 'listener')
    let channelItems = channels.map((channel) => {
      return (
        <ChannelItem key={channel.key} channel={channel} favorites={this.props.favorites}
          registFavorite={this.registFavorite} />
      )
    })
    return(
      <table className="table-striped">
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
