import React from "react"
import Config from 'electron-config'
import {ipcRenderer} from "electron"
const config = new Config({
  defaults: { port: 7144 }
})

module.exports = class ChannelItem extends React.Component {

  constructor(props){
    super(props)
    this.streamURL = this.streamURL.bind(this)
    this.play = this.play.bind(this)
  }

  streamURL(){
    let port = config.get('port')
    var url = `http://127.0.0.1:${port}/pls/${this.props.channel.id}?tip=${this.props.channel.tip}`
    return url
  }

  // プレイヤー起動
  play(){
    ipcRenderer.send('asyn-play', this.props.channel, this.streamURL())
  }

  render(){
    return(
      <tr onClick={this.play}>
        <td className="channel-item-col1">
          <div className="channel-item-name">{this.props.channel.name}</div>
          <div className="channel-item-genre">{this.props.channel.genre}</div>
          <div className="channel-item-detail">{this.props.channel.detail} {this.props.channel.comment}</div>
        </td>
        <td className="channel-item-col2">
          <div className="channel-item-listener">{this.props.channel.listener}/{this.props.channel.relay}</div>
          <div className="channel-item-time">{this.props.channel.time}</div>
        </td>
        <td className="channel-item-col3">
          <div className="channel-item-kbps">{this.props.channel.kbps}</div>
          <div className="channel-item-format">{this.props.channel.format}</div>
        </td>
      </tr>
    )
  }

}
