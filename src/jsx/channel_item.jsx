import React from 'react'
import Config from 'electron-config'
import {ipcRenderer} from 'electron'
import {remote} from 'electron'
import {shell} from 'electron'
const clipboard = remote.clipboard
const Menu =  remote.Menu
const MenuItem =  remote.MenuItem
const config = new Config({
  defaults: { port: 7144 }
})

module.exports = class ChannelItem extends React.Component {

  constructor(props){
    super(props)
    this.getStreamURL = this.getStreamURL.bind(this)
    this.play = this.play.bind(this)
    this.openURL = this.openURL.bind(this)
    this.showContextMenu = this.showContextMenu.bind(this)
    this.getFavorite = this.getFavorite.bind(this)
    this.registFavorite = this.registFavorite.bind(this)
    // コンテキストメニュー
    this.state = { menu: new Menu() }
    this.state.menu.append(new MenuItem({
      label: '再生',
      click: ()=>{
        this.play()
      }
    }))
    this.state.menu.append(new MenuItem({
      label: 'コンタクトURLを開く',
      click: ()=>{
        this.openURL()
      }
    }))
    this.state.menu.append(new MenuItem({
      label: 'BBSブラウザで開く',
      click: ()=>{
        this.openBBS()
      }
    }))
    this.state.menu.append(new MenuItem({
      type: 'separator'
    }))
    this.state.menu.append(new MenuItem({
      label: 'お気に入りに登録',
      type: 'submenu',
      submenu: this.props.favorites.map((favorite, index)=>{
        return {
          label: favorite.name,
          click: ()=>{
            this.registFavorite(index, this.props.channel.name)
          }
        }
      })
    }))
    this.state.menu.append(new MenuItem({
      label: 'コピー',
      type: 'submenu',
      submenu: [
        { label: 'チャンネル名', click: ()=>{ clipboard.writeText(this.props.channel.name) } },
        { label: 'コンタクトURL', click: ()=>{ clipboard.writeText(this.props.channel.url) } },
        { label: 'ストリームURL', click: ()=>{ clipboard.writeText(this.getStreamURL()) } },
        { label: 'IPアドレス', click: ()=>{ clipboard.writeText(this.props.channel.tip.replace(/:\d+$/,"")) } },
        { type: 'separator' },
        {
          label: 'チャンネル詳細一行',
          click: ()=>{
            let text = `${this.props.channel.name}(${this.props.channel.listener}/${this.props.channel.relay})`+
                       `${this.props.channel.genre} ${this.props.channel.detail}`
            if(this.props.channel.comment) text += `「${this.props.channel.comment}」`
            clipboard.writeText(text)
          }
        },
        {
          label: 'チャンネル詳細複数行',
          click: ()=>{
            let text = `${this.props.channel.name}(${this.props.channel.listener}/${this.props.channel.relay})\n`+
                       `${this.props.channel.genre} ${this.props.channel.detail}`
            if(this.props.channel.comment) text += `\n「${this.props.channel.comment}」`
            clipboard.writeText(text)
          }
        }
      ]
    }))

  }

  // プレイヤーで再生する
  play(){
    ipcRenderer.send('asyn-play', this.getStreamURL())
  }

  // コンタクトURLをBBSブラウザで開く
  openBBS(){
    ipcRenderer.send('asyn-open-bbs', this.props.channel.url)
  }

  // コンタクトURLを既定ブラウザで開く
  openURL(){
    shell.openExternal(this.props.channel.url)
  }

  // 右クリメニューを表示
  showContextMenu(e){
    e.preventDefault()
    this.state.menu.popup(remote.getCurrentWindow())
  }

  // ストリームURLを取得
  getStreamURL(){
    let port = config.get('port')
    var url = `http://127.0.0.1:${port}/pls/${this.props.channel.id}?tip=${this.props.channel.tip}`
    return url
  }

  // お気に入り登録
  registFavorite(favoriteIndex, channelName){
    this.props.registFavorite(favoriteIndex, channelName)
  }

  // マッチするお気に入り情報があれば取得
  getFavorite(){
    let res = null
    for(let favorite of this.props.favorites){
      // 検索文字(正規表現)
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

  render(){
    let favorite = this.getFavorite()
    let style = {}
    if(favorite){
      style = {
        background: `#${favorite.bgColor}`,
        color: `#${favorite.fontColor}`
      }
    }
    return(
      <tr className="channel-item" onDoubleClick={this.play} onContextMenu={this.showContextMenu} style={style}>
        <td className="channel-item-col1">
          <div className="channel-item-name">{this.props.channel.name}</div>
          <div className="channel-item-detail">
            {this.props.channel.genre}
            {this.props.channel.detail}
            {this.props.channel.comment}
          </div>
        </td>
        <td className="channel-item-col2">
          <div className="channel-item-listener">{this.props.channel.listener}/{this.props.channel.relay}</div>
          <div className="channel-item-time">{this.props.channel.time}</div>
        </td>
        <td className="channel-item-col3">
          <div className="channel-item-kbps">{this.props.channel.kbps}</div>
          <div className="channel-item-format">{this.props.channel.format}</div>
        </td>
      </tr>
    )
  }

}
