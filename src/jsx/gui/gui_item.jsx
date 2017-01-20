import React from 'react'
import {ipcRenderer, remote, shell} from 'electron'

import Peercast from 'js/peercaststation'

module.exports = class GuiItem extends React.Component{

  constructor(props){
    super(props)
    this.openBBS = this.openBBS.bind(this)
    this.openURL = this.openURL.bind(this)
    this.showContextMenu = this.showContextMenu.bind(this)
  }

  // 切断
  stopChannel(){
    Peercast.stopChannel(this.props.relay.channelId)
  }

  // コンタクトURLをBBSブラウザで開く
  openBBS(){
    ipcRenderer.send('asyn-open-bbs', this.props.relay.info.url)
  }

  // コンタクトURLを既定ブラウザで開く
  openURL(){
    shell.openExternal(this.props.relay.info.url)
  }

  // 右クリメニューを表示
  showContextMenu(e){
    const Menu =  remote.Menu
    const MenuItem =  remote.MenuItem
    let menu = new Menu()
    menu.append(new MenuItem({
      label: '切断',
      click: ()=>{ this.stopChannel() }
    }))
    menu.append(new MenuItem({
      label: '再接続',
      click: ()=>{ this.openURL() }
    }))
    menu.append(new MenuItem({
      type: 'separator'
    }))
    menu.append(new MenuItem({
      label: 'コンタクトURLを開く',
      click: ()=>{ this.openURL() }
    }))
    menu.append(new MenuItem({
      label: 'BBSブラウザで開く',
      click: ()=>{ this.openBBS() }
    }))
    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
  }

  // 秒をhh:mm形式に変換
  parseSec(sec){
    sec = Number(sec)
    let hour = Math.floor(sec/60/60)
    if(hour < 10) hour = "0"+hour
    let min = Math.floor(sec/60)
    if(min < 10) min = "0"+min
    return `${hour}:${min}`
  }

  // 接続状態
  get connectionStatus(){
    var result = ""
    if(this.props.relay.status.isReceiving){
      if(this.props.relay.status.isRelayFull){
        if(this.props.relay.status.localRelays!=null && this.props.relay.status.localRelays>0){
          result = "relayFull"
        }
        else{
          result = "notRelayable"
        }
      }
      else{
        result = "relayable"
      }
    }
    else{
      result = "notReceiving"
    }
    return result
  }

  render(){
    return(
      <tr className="gui-item" onContextMenu={this.showContextMenu}>
        <td className="gui-item-col1">
          <div className="gui-item-name">
            <i className={this.connectionStatus} />
            {this.props.relay.info.name}
          </div>
        </td>
        <td className="gui-item-col2">
          <div className="gui-item-relay">
            {`${this.props.relay.status.totalDirects}/${this.props.relay.status.totalRelays}`}
            {` - [${this.props.relay.status.localDirects}/${this.props.relay.status.localRelays}]`}
          </div>
          <div className="gui-item-time">
            {this.parseSec(this.props.relay.status.uptime)}
          </div>
        </td>
        <td className="gui-item-col3">
          <div className="gui-item-kbps">{this.props.relay.info.bitrate}</div>
          <div className="gui-item-format">{this.props.relay.info.contentType}</div>
        </td>
      </tr>
    )
  }

}
