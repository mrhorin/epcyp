import React from 'react'
import _ from 'lodash'

import ChannelItem from 'jsx/channel/channel_item.jsx'

module.exports = class ChannelBox extends React.Component {

  constructor(props){
    super(props)
    this.registFavorite = this.registFavorite.bind(this)
  }

  // 昇順ソート
  sortASC(hash, key){
    return _.sortBy(hash, (item)=>{
      // 数値化処理
      if(key=='time') return _.toInteger(item[key].replace(/:/, ""))
      if(key=='format') return this.getCharCode(item[key])
      return item[key]
    })
  }

  // 降順ソート
  sortDESC(hash, key){
    return _.sortBy(hash, (item)=>{
      if(key=='time') return - _.toInteger(item[key].replace(/:/, ""))
      if(key=='format') return - this.getCharCode(item[key])
      return - item[key]
    })
  }

  // 文字列をutf-16コードの数値列にして返す
  getCharCode(string){
    let res = ""
    for(let s of string){
      res += s.charCodeAt().toString()
    }
    return _.toInteger(res)
  }

  // ------------ ChannelItem ------------
  registFavorite(favoriteIndex, channelName){
    this.props.registFavorite(favoriteIndex, channelName)
  }

  render(){
    let channels
    // チャンネル一覧をソート
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
