import React from 'react'
import {remote} from 'electron'
const Menu =  remote.Menu
const MenuItem =  remote.MenuItem

module.exports = class HeaderUpdateButton extends React.Component {

  constructor(props){
    super(props)
    this.showContextMenu = this.showContextMenu.bind(this)
    // コンテキストメニュー
    this.state = { menu: new Menu() }
    this.state.menu.append(new MenuItem({
      label: '自動更新',
      type: 'checkbox',
      checked: this.props.isAutoUpdate,
      click: (optional)=>{
        this.props.onClickAutoUpdate()
      }
    }))
  }

  // コンテキストメニューを表示
  showContextMenu(e){
    e.preventDefault()
    this.state.menu.popup(remote.getCurrentWindow())
  }

  render(){
    return(
      <div className="btn-group">
        <button className="btn btn-default btn-mini" onClick={this.props.onClickUpdate}>
          <span className="icon icon-arrows-ccw"></span>
        </button>
        <button id="header-update-dropdown" className="btn btn-default btn-dropdown" onClick={this.showContextMenu}>
        </button>
      </div>
    )
  }

}
