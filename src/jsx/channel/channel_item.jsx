import React from 'react'
import { ipcRenderer, remote, shell } from 'electron'

import Player from 'js/player'

export default class ChannelItem extends React.Component {

  constructor(props){
    super(props)
    this.state = { hovered: false }
  }

  // プレイヤーで再生する
  play = () => {
    let player = new Player(this.props.channel)
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

  // お気に入り登録
  registerFavorite = (favoriteIndex, channelName) => {
    this.props.registerFavorite(favoriteIndex, channelName)
  }

  // 右クリメニューを表示
  showContextMenu = (e) => {
    const clipboard = remote.clipboard
    const Menu =  remote.Menu
    const MenuItem =  remote.MenuItem
    let menu = new Menu()
    menu.append(new MenuItem({
      label: '再生',
      toolTip: this.props.channel.detailInMultipleLines,
      click: ()=>{ this.play() }
    }))
    menu.append(new MenuItem({
      label: 'コンタクトURLを開く',
      click: ()=>{ this.openURL(this.props.channel.url) }
    }))
    menu.append(new MenuItem({
      label: 'BBSブラウザで開く',
      click: ()=>{ this.openBBS(this.props.channel.url, this.props.channel.name) }
    }))
    menu.append(new MenuItem({
      label: '統計URLを開く',
      click: ()=>{ this.openURL(this.props.channel.statisticsURL) }
    }))
    menu.append(new MenuItem({
      type: 'separator'
    }))
    menu.append(new MenuItem({
      label: 'お気に入りに登録',
      type: 'submenu',
      submenu: this.props.favorites.map((favorite, index)=>{
        return {
          label: favorite.name,
          click: () => {
            this.registerFavorite(index, this.props.channel.name)
            // お気に入り表示を反映
            // this.forceUpdate()
          }
        }
      })
    }))
    menu.append(new MenuItem({
      label: 'コピー',
      type: 'submenu',
      submenu: [
        { label: 'チャンネル名', click: ()=>{ clipboard.writeText(this.props.channel.name) } },
        { label: 'コンタクトURL', click: ()=>{ clipboard.writeText(this.props.channel.url) } },
        { label: 'プレイリストURL', click: ()=>{ clipboard.writeText(this.props.channel.playListURL) } },
        { label: 'ストリームURL', click: ()=>{ clipboard.writeText(this.props.channel.streamURL) } },
        { label: 'IPアドレス', click: ()=>{ clipboard.writeText(this.props.channel.tip.replace(/:\d+$/,"")) } },
        { type: 'separator' },
        {
          label: 'チャンネル詳細一行',
          click: ()=>{
            clipboard.writeText(this.props.channel.detailInOneLine)
          }
        },
        {
          label: 'チャンネル詳細複数行',
          click: ()=>{
            clipboard.writeText(this.props.channel.detailInMultipleLines)
          }
        }
      ]
    }))
    menu.append(new MenuItem({
      type: 'separator'
    }))
    menu.append(new MenuItem({
      label: '録画',
      type: 'submenu',
      submenu: [
        { label: '開始', click: () => { this.props.startRecord(this.props.channel) } },
        { label: '停止', click: () => { this.props.stopRecord(this.props.channel) } }
      ]
    }))
    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
  }

  // 中クリック押下時
  onMiddleClick = (event) => {
    if(event.button==1){
      this.openURL()
    }
  }

  get isIPv6() {
    let regx = new RegExp("^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$")
    regx.test(this.props.channel.tip)
  }

  // マッチするお気に入り情報があれば取得
  get favorite(){
    let res = null
    for(let favorite of this.props.favorites){
      // 検索文字欄が空の場合
      if(!favorite.pattern) continue
      let ptn = new RegExp(favorite.pattern, "i")
      // ptnにマッチする AND 検索対象に指定されているか
      if((this.props.channel.name.match(ptn)&&favorite.target.name)||
        (this.props.channel.genre.match(ptn)&&favorite.target.genre)||
        (this.props.channel.detail.match(ptn)&&favorite.target.detail)||
        (this.props.channel.comment.match(ptn)&&favorite.target.comment)||
        (this.props.channel.url.match(ptn)&&favorite.target.url)||
        (this.props.channel.tip.match(ptn)&&favorite.target.tip)){
        res = favorite
        break
      }
    }
    return res
  }

  // カラーコードを暗くして返す
  convertToDarkerColor = (color) => {
    color = String(color)
    // カラーコードを三原色ごとに分割
    let rgb = {
      r: color.slice(0, 2),
      g: color.slice(2, 4),
      b: color.slice(4, 6),
    }
    for (let key in rgb) {
      // 10進数に変換して0.8倍
      rgb[key] = Math.round(parseInt(rgb[key], 16) * 0.8)
      // 16進数に戻す
      rgb[key] = rgb[key].toString(16)
      // 2桁に揃える
      rgb[key] = ("00" + rgb[key]).slice(-2)
    }
    return rgb.r + rgb.g + rgb.b
  }

  activateHovered = () => {
    this.setState({ hovered: true })
  }

  deactivateHovered = () => {
    this.setState({ hovered: false })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.channel != nextProps.channel ||
      this.props.fontSize != nextProps.fontSize ||
      this.props.favorites != nextProps.favorites ||
      this.state.hovered != nextState.hovered
  }

  render() {
    let favorite = this.favorite
    let style = { fontSize: `${this.props.fontSize}px` }
    let nameClass = "channel-item-name"
    let descClass = "channel-item-desc"
    if (this.props.descNowrap) descClass += " channel-item-desc-nowrap"
    if (favorite && !favorite.isDisableColor) {
      if(this.props.channel.url) nameClass += ' channel-item-name-favorite'
      style['color'] = `#${favorite.fontColor}`
      // hover時は背景を暗くする
      if (this.state.hovered) {
        style['background'] = `#${this.convertToDarkerColor(favorite.bgColor)}`
      } else {
        style['background'] = `#${favorite.bgColor}`
      }
      // 無視リストの時は非表示に
      if (favorite.isIgnore) style['visibility'] = 'collapse'
    }
    // コンタクトURLがある場合はリンク色に
    if(this.props.channel.url) nameClass += " link"
    return (
      <div className="channel-item" style={style}
        onClick={this.onMiddleClick}
        onDoubleClick={this.play}
        onContextMenu={this.showContextMenu}
        onMouseEnter={this.activateHovered}
        onMouseLeave={this.deactivateHovered}>
        <div className="channel-item-col1">
          <div className={nameClass}>{this.props.channel.name}</div>
          <div className={descClass}>{this.props.channel.desc}</div>
        </div>
        <div className="channel-item-col2">
          <div className="channel-item-listener">{this.props.channel.listener}/{this.props.channel.relay}</div>
          <div className="channel-item-time">{this.props.channel.time}</div>
        </div>
        <div className="channel-item-col3">
          <div className="channel-item-kbps">{this.props.channel.kbps}</div>
          <div className="channel-item-format">{this.props.channel.format}</div>
        </div>
      </div>
    )
  }

}
