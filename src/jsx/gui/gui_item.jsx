import React from 'react'

import GuiControl from 'jsx/gui/gui_control'

module.exports = class GuiItem extends React.Component{

  constructor(props){
    super(props)
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

  // 秒をhh:mm形式に変換
  parseSec(sec){
    sec = Number(sec)
    let hour = Math.floor(sec/60/60)
    if(hour < 10) hour = "0"+hour
    let min = Math.floor(sec/60)
    if(min < 10) min = "0"+min
    return `${hour}:${min}`
  }

  render(){
    return(
      <tr className="gui-item">
        <td className="gui-item-col1">
          <div className="gui-item-name">
            <i className={this.connectionStatus} />
            {this.props.relay.info.name}
          </div>
          <div className="gui-item-control">
            <GuiControl />
          </div>
        </td>
        <td className="gui-item-col2">
          <div className="gui-item-relay">
            {`${this.props.relay.status.localDirects}/${this.props.relay.status.localRelays}`}
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
