import React from 'react'
import Config from 'electron-config'
import {ipcRenderer} from 'electron'
import {remote} from 'electron'
import {shell} from 'electron'
const Menu =  remote.Menu
const MenuItem =  remote.MenuItem
const config = new Config({
  defaults: { port: 7144 }
})

module.exports = class ChannelItem extends React.Component {

  constructor(props){
    super(props)
    this.streamURL = this.streamURL.bind(this)
    this.play = this.play.bind(this)
    this.openURL = this.openURL.bind(this)
    this.showContextMenu = this.showContextMenu.bind(this)
    // コンテキストメニュー
    this.state = { menu: new Menu() }
    this.state.menu.append(new MenuItem({
      label: '再生',
      click: ()=>{
        this.play()
      }
    }))
    this.state.menu.append(new MenuItem({
      label: 'コンタクトURLを開く',
      click: ()=>{
        this.openURL()
      }
    }))
    this.state.menu.append(new MenuItem({
      label: 'BBSブラウザで開く',
      click: ()=>{
        this.openBBS()
      }
    }))
  }

  streamURL(){
    let port = config.get('port')
    var url = `http://127.0.0.1:${port}/pls/${this.props.channel.id}?tip=${this.props.channel.tip}`
    return url
  }

  // プレイヤー起動
  play(){
    ipcRenderer.send('asyn-play', this.streamURL())
  }

  // BBSブラウザで開く
  openBBS(){
    ipcRenderer.send('asyn-open-bbs', this.props.channel.url)
  }

  // コンタクトURLを開く
  openURL(){
    shell.openExternal(this.props.channel.url)
  }

  showContextMenu(e){
    e.preventDefault()
    this.state.menu.popup(remote.getCurrentWindow())
  }

  render(){
    return(
      <tr onDoubleClick={this.play} onContextMenu={this.showContextMenu}>
        <td className="channel-item-col1">
          <div className="channel-item-name">{this.props.channel.name}</div>
          <div className="channel-item-detail">
            {this.props.channel.genre}
            {this.props.channel.detail}
            {this.props.channel.comment}
          </div>
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
