import React from 'react'
import ChannelItem from 'jsx/channel_item.jsx'
import _ from 'lodash'

module.exports = class ChannelBox extends React.Component {

  constructor(props){
    super(props)
    this.registFavorite = this.registFavorite.bind(this)
  }

  // 昇順ソート
  sortASC(hash, key){
    return _.sortBy(hash, key)
  }

  // 降順ソート
  sortDESC(hash, key){
    return _.sortBy(hash, (item)=>{ return - item[key] })
  }

  // ------------ ChannelItem ------------
  registFavorite(favoriteIndex, channelName){
    this.props.registFavorite(favoriteIndex, channelName)
  }

  render(){
    let channels
    if(this.props.sort.orderBy=='asc'){
      channels = this.sortASC(this.props.channels, this.props.sort.key)
    }else{
      channels = this.sortDESC(this.props.channels, this.props.sort.key)
    }
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
