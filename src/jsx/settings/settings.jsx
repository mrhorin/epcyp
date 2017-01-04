import React from "react"
import ReactDOM from "react-dom"
import {ipcRenderer} from "electron"
import {remote} from 'electron'
import css from "scss/style"
import Config from 'electron-config'
import SettingsTabBox from 'jsx/settings/settings_tab_box'
import SettingsGeneral from 'jsx/settings/settings_general'
import SettingsYP from 'jsx/settings/settings_yp'

const dialog = remote.dialog
const config = new Config({
  defaults: { port: 7144, player: "", bbs: "" }
})

class Settings extends React.Component {

  constructor(props){
    super(props)
    this.save = this.save.bind(this)
    this.selectTab = this.selectTab.bind(this)
    this.onChangeForm = this.onChangeForm.bind(this)
    this.onClickDialog = this.onClickDialog.bind(this)
    this.state = {
      port: config.get('port'),
      player: config.get('player'),
      bbs: config.get('bbs'),
      currentTabIndex: 0,
    }
  }

  // 設定保存
  save(){
    config.set('port', this.state.port)
    config.set('player', this.state.player)
    config.set('bbs', this.state.bbs)
    this.close()
  }

  // 設定ウィンドウを閉じる
  close(){
    ipcRenderer.send('asyn-config-window-close')
  }

  // タブの切り替え
  selectTab(index){
    this.setState({ currentTabIndex: index })
  }

  onChangeForm(event, key){
    this.setState({ [key]: event.target.value })
  }

  onClickDialog(key){
    let path = dialog.showOpenDialog()
    this.setState({ [key]: path[0] })
  }

  render(){
    // 各タブ用コンポーネント
    let components = [
      {
        name: "全般",
        component:
          <SettingsGeneral port={this.state.port} player={this.state.player} bbs={this.state.bbs}
            onClickDialog={this.onClickDialog} onChangeForm={this.onChangeForm}  />
      },
      {
        name: "YP",
        component: <SettingsYP />
      }
    ]
    // カレントコンポーネント
    let currentComponent = components[this.state.currentTabIndex].component

    return(
      <div id="settings">
        <header className="toolbar toolbar-header">
          <h1 className="title">
            <span className="icon icon-cog"></span>
            設定
          </h1>
        </header>
        <SettingsTabBox components={components} currentTabIndex={this.state.currentTabIndex}
          selectTab={this.selectTab} />
        <div id="settings-main">
          {currentComponent}
          <div id="settings-btn-group">
            <button id="settings-ok" className="btn btn-primary" onClick={this.save}>OK</button>
            <button id="settings-cancel" className="btn btn-default" onClick={this.close}>キャンセル</button>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Settings />,
  document.getElementById('container-settings')
)
