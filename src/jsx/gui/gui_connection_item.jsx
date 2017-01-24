import React from 'react'
import _ from 'lodash'

module.exports = class GuiConnectionItem extends React.Component{

  constructor(props){
    super(props)
  }

  // arrayにvalueが含まれているか
  inArray(value, array){
    if(_.indexOf(array, value) >= 0){
      return true
    }else{
      return false
    }
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

  render(){
    let status = this.connectionStatus
    let className = "gui-connection-item"
    if(this.props.current==this.props.index) className += " gui-connection-item-active"
    return(
      <li className={className} onClick={()=>{ this.props.onClickItem(this.props.index) }}>
        <i className={status} />
        {`${this.props.connection.protocolName} ${this.props.connection.status}`}
      </li>
    )
  }

}
