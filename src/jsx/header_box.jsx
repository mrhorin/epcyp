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
    this.props.onClickHandler()
  }

  // 設定ボタン押下時
  onClickConfig(){
    ipcRenderer.send('asyn-config-window')
  }

  render(){
    // 更新ボタンのCSSクラス
    var autoUpdateClass = this.props.autoUpdate ? "btn btn-primary" : "btn btn-default"
    return(
      <header className="toolbar toolbar-header">
        <h1 className="title">
          <span className="icon icon-megaphone"></span>
          epcyp
        </h1>
        <div className="toolbar-actions">
          <HeaderButton key={1} btnClass={autoUpdateClass} icon={"icon-arrows-ccw"} onClickhandler={this.onClickUpdate}/>
          <div className="btn-group">
            <HeaderButton key={2} btnClass="btn btn-default" icon={"icon-star"} onClickhandler={this.onClickConfig}/>
            <HeaderButton key={3} btnClass="btn btn-default" icon={"icon-cog"} onClickhandler={this.onClickConfig}/>
          </div>
        </div>
      </header>
    )
  }

}
