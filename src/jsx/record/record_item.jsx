import React from 'react'
import { ipcRenderer, remote, shell } from 'electron'

import Player from 'js/player'

export default class RecordItem extends React.Component{

  constructor(props){
    super(props)
  }

  // プレイヤーで再生する
  play = () => {
    let player = new Player(this.props.record.channel)
    player.play()
  }

  // BBSブラウザで開く
  openBBS = (url, name) => {
    ipcRenderer.send('asyn-open-bbs', url, name)
  }

  // 既定ブラウザで開く
  openURL = (url) => {
    shell.openExternal(url)
  }

  showContextMenu = (e) => {
    const clipboard = remote.clipboard
    const Menu =  remote.Menu
    const MenuItem =  remote.MenuItem
    let menu = new Menu()
    menu.append(new MenuItem({
      label: '録画停止',
      click: ()=>{ this.props.stopRecord(this.props.record.channel) }
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
      click: ()=>{ this.openURL(this.props.record.channel.url) }
    }))
    menu.append(new MenuItem({
      label: 'BBSブラウザで開く',
      click: ()=>{ this.openBBS(this.props.record.channel.url, this.props.record.channel.name) }
    }))
    menu.append(new MenuItem({
      label: '統計URLを開く',
      click: ()=>{ this.openURL(this.props.record.channel.statisticsURL) }
    }))
    menu.append(new MenuItem({
      type: 'separator'
    }))
    menu.append(new MenuItem({
      label: 'コピー',
      type: 'submenu',
      submenu: [
        { label: 'チャンネル名', click: ()=>{ clipboard.writeText(this.props.record.channel.name) } },
        { label: 'コンタクトURL', click: ()=>{ clipboard.writeText(this.props.record.channel.url) } },
        { label: 'プレイリストURL', click: ()=>{ clipboard.writeText(this.props.record.channel.playListURL) } },
        { label: 'ストリームURL', click: ()=>{ clipboard.writeText(this.props.record.channel.streamURL) } },
        { label: 'IPアドレス', click: ()=>{ clipboard.writeText(this.props.record.channel.tip.replace(/:\d+$/,"")) } },
        { type: 'separator' },
        {
          label: 'チャンネル詳細一行',
          click: ()=>{
            clipboard.writeText(this.props.record.channel.detailInOneLine)
          }
        },
        {
          label: 'チャンネル詳細複数行',
          click: ()=>{
            clipboard.writeText(this.props.record.channel.detailInMultipleLines)
          }
        }
      ]
    }))
    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
  }

  // バイト表記に変換
  convertToByte = (size) => {
    let digit = String(size).length
    if (digit > 9) {
      size = Number(size) * Math.pow(10.24, -9)
      // GBの時は少数第2位まで表示
      let sizeGB = Math.round(size*100) / 100
      size = sizeGB.toLocaleString() + " GB"
    }else if (digit > 6) {
      size = Number(size) *  Math.pow(10.24, -6)
      size = Math.round(size).toLocaleString() + " MB"
    }else if (digit > 3) {
      size = Number(size) *  Math.pow(10.24, -3)
      size = Math.round(size).toLocaleString() + " KB"
    } else {
      size = Number(size).toLocaleString() + "B"
    }
    return size
  }

  render() {
    let progress
    if (this.props.record.progress == "continue") {
      progress = "🔴録画中"
    } else if (this.props.record.progress == "end") {
      progress = "終了"
    } else if (this.props.record.progress == "connecting") {
      progress = "接続中"
    }
    let style = { fontSize: `${this.props.fontSize}px` }
    return(
      <div className="record-item" style={style} onContextMenu={this.showContextMenu}>
        <div className="record-item-col1">{ this.props.record.channel.name }</div>
        <div className="record-item-col2">{ this.convertToByte(this.props.record.size) }</div>
        <div className="record-item-col3">{this.props.record.time}</div>
        <div className="record-item-col4">{progress}</div>
      </div>
    )
  }

}
