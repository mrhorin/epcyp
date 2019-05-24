import React from 'react'
import {ipcRenderer} from 'electron'

import HeaderButton from 'jsx/index/header_button'
import HeaderUpdateButton from 'jsx/index/header_update_button'
import HeaderSearch from 'jsx/index/header_search'

export default class HeaderBox extends React.Component {

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
        <div className="flex-container">
          {/*更新ボタン*/}
          <HeaderUpdateButton isAutoUpdate={this.props.isAutoUpdate} onClickUpdate={this.props.onClickUpdate} onClickAutoUpdate={this.props.onClickAutoUpdate} />
          {/*設定ボタン*/}
          <div className="flex-header-settings-btns">
            <div className="btn-group">
              <HeaderButton key={1} icon={"icon-star"} onClickhandler={this.onClickFavorite}/>
              <HeaderButton key={2} icon={"icon-cog"} onClickhandler={this.onClickConfig}/>
            </div>
          </div>
          {/*検索フォーム*/}
          <HeaderSearch setSearchWord={word=>{ this.props.setSearchWord(word) }} />
        </div>
      </header>
    )
  }

}
