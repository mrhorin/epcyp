import React from 'react'
import {remote} from 'electron'
import _ from 'lodash'

import Peercast from 'js/peercaststation'

export default class GuiConnectionItem extends React.Component{

  constructor(props){
    super(props)
    this.showContextMenu = this.showContextMenu.bind(this)
    this.stopChannelConnection = this.stopChannelConnection.bind(this)
  }

  // 接続を切断
  stopChannelConnection(){
    Peercast.stopChannelConnection(
      this.props.relay.channelId,
      this.props.connection.connectionId
    )
  }

  // 右クリメニューを表示
  showContextMenu(e){
    const Menu =  remote.Menu
    const MenuItem =  remote.MenuItem
    let menu = new Menu()
    menu.append(new MenuItem({
      label: '切断',
      click: ()=>{ this.stopChannelConnection() }
    }))
    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
  }

  // arrayにvalueが含まれているか
  inArray(value, array){
    if(_.indexOf(array, value) >= 0){
      return true
    }else{
      return false
    }
  }

  toString(value){
    if(value==undefined||value==null) return ""
    return String(value)
  }

  // 接続状態を取得
  get connectionStatus(){
    let conn = this.props.connection
    let result = "unknown"
    switch(conn.type){
      case "relay":
        if(this.inArray("receiving", conn.remoteHostStatus)){
          if(this.inArray("firewalled", conn.remoteHostStatus)&&
            !this.inArray("local", conn.remoteHostStatus)){
            // ポート未開放
            if(conn.localRelays!=null && conn.localRelays>0){
              result = "firewalledRelaying"
            }else{
              result = "firewalled"
            }
          }else if(this.inArray("relayFull", conn.remoteHostStatus)){
            // これ以上リレーできない
            if(conn.localRelays!=null && conn.localRelays>0){
              result = "relayFull"
            }else{
              result = "notRelayable"
            }
          }else{
            // リレー可能
            result = "relayable"
          }
        }else{
          result = "notReceiving"
        }
        break
      case "play":
        break
      case "announce":
      case "source":
      default:
        if(this.inArray("root", conn.remoteHostStatus)) result = "connectionToRoot"
        if(this.inArray("tracker", conn.remoteHostStatus)) result = "connectionToTracker"
        break
    }
    return result
  }

  // agentNameの略語を取得
  get agentShortName(){
    let name = String(this.props.connection.agentName)
    // PeerCastStion:ST
    if(name.match(/^PeerCastStation/i)){
      return "ST"+name.match(/(?:\/)\d.+/)[0].replace(/\.|\//g,"")
    }
    if(name == "null") return ""
    return name
  }

  // 表示用
  get displayFormat(){
    let relay = ""
    if(this.props.connection.type == "relay"){
      relay = `[${this.props.connection.localDirects}/${this.props.connection.localRelays}] `
    }
    return String(`${this.toString(this.props.connection.protocolName)} `+
                  `${this.toString(this.props.connection.status)} `+
                  `(${this.toString(this.props.connection.remoteEndPoint)}) `+
                  `${relay}`+
                  `${this.toString(this.agentShortName)}`)
  }

  render(){
    let className = "gui-connection-item"
    if(this.props.current==this.props.index) className += " gui-connection-item-active"
    return(
      <li className={className} onContextMenu={this.showContextMenu}>
        <i className={this.connectionStatus} />
        {this.displayFormat}
      </li>
    )
  }

}
