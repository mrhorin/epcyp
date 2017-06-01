import React from 'react'
import {ipcRenderer} from 'electron'

import HeaderButton from 'jsx/index/header_button'
import HeaderUpdateButton from 'jsx/index/header_update_button'
import HeaderSearch from 'jsx/index/header_search'

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
    return(
      <header className="toolbar toolbar-header">
        <h1 className="title">
        </h1>
        <div className="toolbar-actions">
          <HeaderUpdateButton autoUpdate={this.props.autoUpdate} onClickUpdate={this.props.onClickUpdate} onClickAutoUpdate={this.props.onClickAutoUpdate}/>
          <div className="btn-group">
            <HeaderButton key={1} icon={"icon-star"} onClickhandler={this.onClickFavorite}/>
            <HeaderButton key={2} icon={"icon-cog"} onClickhandler={this.onClickConfig}/>
          </div>
          <HeaderSearch setSearchWord={word=>{ this.props.setSearchWord(word) }} />
        </div>
      </header>
    )
  }

}
