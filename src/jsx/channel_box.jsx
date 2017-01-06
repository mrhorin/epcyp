import React from 'react'
import ChannelItem from 'jsx/channel_item.jsx'

module.exports = class ChannelBox extends React.Component {

  constructor(props){
    super(props)
    this.getFavorite = this.getFavorite.bind(this)
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

  // channelにマッチするお気に入り情報を取得
  getFavorite(channel){
    let res = null
    for(let favorite of this.props.favorites){
      // 検索文字(正規表現)
      let ptn = new RegExp(favorite.pattern, "i")
      // ptnにマッチする AND 検索対象に指定されているか
      if((channel.name.match(ptn)&&favorite.target.name)||
        (channel.genre.match(ptn)&&favorite.target.genre)||
        (channel.detail.match(ptn)&&favorite.target.detail)||
        (channel.comment.match(ptn)&&favorite.target.comment)||
        (channel.url.match(ptn)&&favorite.target.url)||
        (channel.tip.match(ptn)&&favorite.target.tip)){
        res = favorite
        break
      }
    }
    return res
  }

  render(){
    let channels = this.sortDESC(this.props.channels, 'listener')
    let channelItems = channels.map((channel) => {
      let favorite = this.getFavorite(channel)
      return (
        <ChannelItem key={channel.key} channel={channel} favorite={favorite} />
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
