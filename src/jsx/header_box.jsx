import React from 'react'
import {ipcRenderer} from 'electron'
import HeaderButton from 'jsx/header_button.jsx'
import HeaderUpdateButton from 'jsx/header_update_button.jsx'

module.exports = class HeaderBox extends React.Component {

  constructor(props){
    super(props)
  }

  // お気に入りボタン押下時
  onClickFavorite(){
    ipcRenderer.send('asyn-favorite-window')
  }

  // 設定ボタン押下時
  onClickConfig(){
    ipcRenderer.send('asyn-settings-window')
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
          <HeaderUpdateButton autoUpdate={this.props.autoUpdate} onClickUpdate={this.props.onClickUpdate} onClickAutoUpdate={this.props.onClickAutoUpdate}/>
          <div className="btn-group">
            <HeaderButton key={1} icon={"icon-star"} onClickhandler={this.onClickFavorite}/>
            <HeaderButton key={2} icon={"icon-cog"} onClickhandler={this.onClickConfig}/>
          </div>
        </div>
      </header>
    )
  }

}
