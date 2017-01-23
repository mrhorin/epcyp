import React from 'react'
import _ from 'lodash'

module.exports = class GuiItemConnections extends React.Component{

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
  getConnectionStatus(conn){
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
    let connections = this.props.connections.map((conn, index)=>{
      let status = this.getConnectionStatus(conn)
      return(
        <li key={conn.connectionId}>
          <i className={status} />
          {`${conn.protocolName} ${conn.status}`}
        </li>
      )
    })
    return(
      <ul className="gui-item-connections">
        {connections}
      </ul>
    )
  }

}
