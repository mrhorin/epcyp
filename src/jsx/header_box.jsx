import React from "react"
import {ipcRenderer} from "electron"
import HeaderButton from "jsx/header_button.jsx"

module.exports = class HeaderBox extends React.Component {

  constructor(props){
    super(props)
    this.onClickUpdate = this.onClickUpdate.bind(this)
  }

  // 更新ボタン押下時
  onClickUpdate(){
    this.props.onClickhandler()
  }

  // 設定ボタン押下時
  onClickConfig(){
    ipcRenderer.send('asyn-config-window')
  }

  render(){
    return(
      <header className="toolbar toolbar-header">
        <h1 className="title">
          <span className="icon icon-megaphone"></span>
          epcyp
        </h1>
        <div className="toolbar-actions">
          <HeaderButton key={1} icon={"icon-arrows-ccw"} onClickhandler={this.onClickUpdate}/>
          <div className="btn-group">
            <HeaderButton key={2} icon={"icon-star"} onClickhandler={this.onClickConfig}/>
            <HeaderButton key={3} icon={"icon-cog"} onClickhandler={this.onClickConfig}/>
          </div>
        </div>
      </header>
    )
  }

}