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
    // headerのアクティブ状態
    var headerClass = this.props.active ? "toolbar toolbar-header" : "toolbar toolbar-header blur"
    // darwin環境時
    if(global.process.platform == 'darwin') headerClass += " darwin"
    return(
      <header className={headerClass}>
        <h1 className="title">
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
