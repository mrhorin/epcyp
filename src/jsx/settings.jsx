import React from "react"
import ReactDOM from "react-dom"
import {ipcRenderer} from "electron"
import {remote} from 'electron'
import css from "scss/style"
import Config from 'electron-config'
const dialog = remote.dialog
const config = new Config({
  defaults: { port: 7144, player: "" }
})

class Settings extends React.Component {

  constructor(props){
    super(props)
    this.save = this.save.bind(this)
    this.onChangePort = this.onChangePort.bind(this)
    this.onChangePlayer = this.onChangePlayer.bind(this)
    this.onClickPlayerDialog = this.onClickPlayerDialog.bind(this)
    this.state = {
      port: config.get('port'),
      player: config.get('player')
    }
  }

  // 設定保存
  save(){
    config.set('port', this.state.port)
    config.set('player', this.state.player)
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

  onClickPlayerDialog(){
    let path = dialog.showOpenDialog()
    this.setState({ player: path })
  }

  render(){
    return(
      <div>
        <header className="toolbar toolbar-header">
          <h1 className="title">
            <span className="icon icon-cog"></span>
            設定
          </h1>
        </header>
        <div id="settings-main">
          <div className="form-group">
            <label>ポート番号</label>
            <input type="text" className="form-control" ref="port" value={this.state.port} onChange={this.onChangePort} />
          </div>
          <div className="form-group">
            <label>再生プレイヤー</label>
            <input id="settings-player" type="text" className="form-control" ref="player" value={this.state.player} onChange={this.onChangePlayer} />
            <button id="settings-player-dialog" className="btn btn-default" onClick={this.onClickPlayerDialog}>参照</button>
          </div>
          <button id="settings-ok" className="btn btn-default" onClick={this.save}>OK</button>
          <button id="settings-cancel" className="btn btn-default" onClick={this.close}>キャンセル</button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Settings />,
  document.getElementById('container-settings')
)
