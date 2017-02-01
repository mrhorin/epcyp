import React from 'react'
import {ipcRenderer, remote, shell} from 'electron'

import Peercast from 'js/peercaststation'
import Player from 'js/player'
import Channel from 'js/channel'

import GuiConnectionBox from 'jsx/gui/gui_connection_box'

module.exports = class GuiItem extends React.Component{

  constructor(props){
    super(props)
    this.play = this.play.bind(this)
    this.openBBS = this.openBBS.bind(this)
    this.openURL = this.openURL.bind(this)
    this.showContextMenu = this.showContextMenu.bind(this)
    this.switchConnections = this.switchConnections.bind(this)
    this.startUpdateConnections = this.startUpdateConnections.bind(this)
    this.stopUpdateConnections = this.stopUpdateConnections.bind(this)
    this.onClick = this.onClick.bind(this)
    this.state = {
      showConnections: false,
      connections: []
    }
  }

  // 接続一覧の更新を開始
  startUpdateConnections(call=()=>{}){
    Peercast.getChannelConnections(this.props.relay.channelId, (err, res)=>{
      let connections = []
      if(res && res.status == 200 && !res.error && res.text){
        let json = JSON.parse(res.text)
        if(json.result) connections = json.result
      }
      if(this._isMounted){
        this.setState({ connections: connections })
        call()
        this.updateConnectionsTimer = setTimeout(()=>{ this.startUpdateConnections() }, 1000)
      }
    })
  }

  // 接続一覧の更新を停止
  stopUpdateConnections(call=()=>{}){
    clearTimeout(this.updateConnectionsTimer)
    call()
  }

  // 切断
  stopChannel(){
    this.stopUpdateConnections(()=>{
      Peercast.stopChannel(this.props.relay.channelId)
      /*--------------------------------------------
      もし切断できなかったらstartUpdateConnectionsする処理
      ---------------------------------------------*/
    })
  }

  // 再接続
  bumpChannel(){
    Peercast.bumpChannel(this.props.relay.channelId)
  }

  // 再生
  play(){
    let channel = new Channel({
      key: this.props.relay.info.name+this.props.relay.channelId,
      id: this.props.relay.channelId,
      name: this.props.relay.info.name,
      tip: this.props.relay.status.source.replace(/^(pcp:\/\/)/,"").match(/^\d.+:\d+/)[0],
      format: this.props.relay.info.contentType,
      genre: this.props.relay.info.genre,
      detail: this.props.relay.info.desc,
      url: this.props.relay.info.url
    })
    let player = new Player(channel)
    player.play()
  }

  // コンタクトURLをBBSブラウザで開く
  openBBS(){
    ipcRenderer.send('asyn-open-bbs', this.props.relay.info.url)
  }

  // コンタクトURLを既定ブラウザで開く
  openURL(){
    shell.openExternal(this.props.relay.info.url)
  }

  // 接続一覧の表示/非表示の切り替え
  switchConnections(){
    // 接続一覧の自動更新の開始/停止
    if(this.state.showConnections){
      this.stopUpdateConnections()
    }else{
      this.startUpdateConnections()
    }
    this.setState({
      showConnections: !this.state.showConnections
    })
  }

  // 右クリメニューを表示
  showContextMenu(e){
    const Menu =  remote.Menu
    const MenuItem =  remote.MenuItem
    let menu = new Menu()
    menu.append(new MenuItem({
      label: '切断',
      click: ()=>{ this.stopChannel() }
    }))
    menu.append(new MenuItem({
      label: '再接続',
      click: ()=>{ this.bumpChannel() }
    }))
    menu.append(new MenuItem({
      type: 'separator'
    }))
    menu.append(new MenuItem({
      label: '接続一覧',
      click: ()=>{ this.switchConnections() }
    }))
    menu.append(new MenuItem({
      type: 'separator'
    }))
    menu.append(new MenuItem({
      label: '再生',
      click: ()=>{ this.play() }
    }))
    menu.append(new MenuItem({
      label: 'コンタクトURLを開く',
      click: ()=>{ this.openURL() }
    }))
    menu.append(new MenuItem({
      label: 'BBSブラウザで開く',
      click: ()=>{ this.openBBS() }
    }))
    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
  }

  // 秒をhh:mm形式に変換
  parseSec(sec){
    sec = Number(sec)
    let hour = Math.floor(sec/60/60)
    if(hour < 10) hour = "0"+hour
    let min = Math.floor(sec/60)
    if(min > 59) min = min%60
    if(min < 10) min = "0"+min
    return `${hour}:${min}`
  }

  // 接続状態を取得
  get connectionStatus(){
    var result = ""
    if(this.props.relay.status.isReceiving){
      if(this.props.relay.status.isRelayFull){
        if(this.props.relay.status.localRelays!=null && this.props.relay.status.localRelays>0){
          result = "relayFull"
        }
        else{
          result = "notRelayable"
        }
      }
      else{
        result = "relayable"
      }
    }
    else{
      result = "notReceiving"
    }
    return result
  }

  onClick(event){
    if(event.button==1){
      // 中クリック時
      this.openURL()
    }else{
      this.switchConnections()
    }
  }

  componentDidMount(){
    this._isMounted = true
  }

  componentWillUnmount(){
    this.stopUpdateConnections()
    this._isMounted = false
  }

  render(){
    // 接続一覧
    let connectionBox
    if(this.state.showConnections){
      // GuiItemが非アクティブ時は接続一覧も非アクティブにする
      let currentConnection = this.state.currentConnection
      if(this.props.current!=this.props.index) currentConnection = -1
      connectionBox =
        <GuiConnectionBox connections={this.state.connections}
          relay={this.props.relay} current={currentConnection} />
    }
    // アクティブ状態
    let className = "gui-item"
    if(this.props.current==this.props.index) className += " gui-item-active"
    return(
      <div className={className}>
        <div className="gui-item-row1"
          onClick={this.onClick}
          onContextMenu={this.showContextMenu}>
          <div className="gui-item-col1">
            <div className="gui-item-name">
              <i className={this.connectionStatus} />
              {this.props.relay.info.name}
            </div>
          </div>
          <div className="gui-item-col2">
            <div className="gui-item-relay">
              {`${this.props.relay.status.totalDirects}/${this.props.relay.status.totalRelays}`}
              {` [${this.props.relay.status.localDirects}/${this.props.relay.status.localRelays}]`}
            </div>
            <div className="gui-item-time">
              {this.parseSec(this.props.relay.status.uptime)}
            </div>
          </div>
          <div className="gui-item-col3">
            <div className="gui-item-kbps">{this.props.relay.info.bitrate}</div>
            <div className="gui-item-format">{this.props.relay.info.contentType}</div>
          </div>
        </div>
        <div className="gui-item-row2">
          {connectionBox}
        </div>
      </div>
    )
  }

}
