import React from "react"
import ReactDOM from "react-dom"
import {ipcRenderer} from "electron"
import css from "scss/style"
import Config from 'electron-config'
const config = new Config({
  defaults: { port: 7144, player: "" }
})

class Settings extends React.Component {

  constructor(props){
    super(props)
    this.save = this.save.bind(this)
    this.onChangePort = this.onChangePort.bind(this)
    this.onChangePlayer = this.onChangePlayer.bind(this)
    this.state = {
      port: config.get('port'),
      player: config.get('player')
    }
    console.log(this.state)
  }

  // 設定保存
  save(){
    config.set('port', this.state.port)
    config.set('player', this.state.player)
    ipcRenderer.send('asyn-config-window-close')
  }

  close(){
    ipcRenderer.send('asyn-config-window-close')
  }

  onChangePort(event){
    this.setState({
      port: event.target.value
    })
  }

  onChangePlayer(event){
    this.setState({
      player: event.target.value
    })
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
          <form className="configForm">
            <div className="form-group">
              <label>ポート番号</label>
              <input type="text" className="form-control" ref="port" value={this.state.port} onChange={this.onChangePort} />
            </div>
            <div className="form-group">
              <label>プレイヤーパス</label>
              <input type="text" className="form-control" ref="player" value={this.state.player} onChange={this.onChangePlayer} />
            </div>
          </form>
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
