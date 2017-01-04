import React from "react"
import ReactDOM from "react-dom"
import {ipcRenderer} from "electron"
import {remote} from 'electron'
import css from "scss/style"
import Config from 'electron-config'
import SettingsTabBox from 'jsx/settings/settings_tab_box'
const dialog = remote.dialog
const config = new Config({
  defaults: { port: 7144, player: "", bbs: "" }
})

class Settings extends React.Component {

  constructor(props){
    super(props)
    this.save = this.save.bind(this)
    this.onChangePort = this.onChangePort.bind(this)
    this.onChangePlayer = this.onChangePlayer.bind(this)
    this.onChangeBbs = this.onChangeBbs.bind(this)
    this.onClickPlayerDialog = this.onClickPlayerDialog.bind(this)
    this.onClickBbsDialog = this.onClickBbsDialog.bind(this)
    this.state = {
      port: config.get('port'),
      player: config.get('player'),
      bbs: config.get('bbs')
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

  onChangePort(event){
    this.setState({ port: event.target.value })
  }

  onChangePlayer(event){
    this.setState({ player: event.target.value })
  }

  onChangeBbs(event){
    this.setState({ bbs: event.target.value })
  }

  onClickPlayerDialog(){
    let path = dialog.showOpenDialog()
    this.setState({ player: path })
  }

  onClickBbsDialog(){
    let path = dialog.showOpenDialog()
    this.setState({ bbs: path })
  }

  render(){
    return(
      <div id="settings">
        <header className="toolbar toolbar-header">
          <h1 className="title">
            <span className="icon icon-cog"></span>
            設定
          </h1>
        </header>
        <SettingsTabBox />
        <div id="settings-main">
          <div className="form-group">
            <label>ポート番号</label>
            <input type="text" ref="port" value={this.state.port} onChange={this.onChangePort} />
          </div>
          <div className="form-group">
            <label>再生プレイヤー</label>
            <input id="settings-player" type="text" ref="player" value={this.state.player} onChange={this.onChangePlayer} />
            <button id="settings-player-dialog" className="btn btn-mini btn-default" onClick={this.onClickPlayerDialog}>参照</button>
          </div>
          <div className="form-group">
            <label>BBSブラウザ</label>
            <input id="settings-bbs" type="text" ref="bbs" value={this.state.bbs} onChange={this.onChangeBbs} />
            <button id="settings-bbs-dialog" className="btn btn-mini btn-default" onClick={this.onClickBbsDialog}>参照</button>
          </div>
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
