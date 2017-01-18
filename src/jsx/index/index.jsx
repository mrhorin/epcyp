import React from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'
import {shell} from 'electron'
import Config from 'electron-config'
import storage from 'electron-json-storage'
import moment from 'moment'

import YP from 'js/yp'
import css from 'scss/style'

import HeaderBox from 'jsx/index/header_box'
import FooterBox from 'jsx/index/footer_box'
import TabBox from 'jsx/tab/tab_box'
import ChannelBox from 'jsx/channel/channel_box'

const config = new Config({
  defaults: { autoUpdate: false, sortKey: "listener", sortOrderBy: "desc" }
})
// 起動時間
const startedAt = moment()

class Index extends React.Component {

  constructor(props){
    super(props)
    this.bindEvents = this.bindEvents.bind(this)
    this.add = this.add.bind(this)
    this.loadFavorites = this.loadFavorites.bind(this)
    this.loadYpListSettings = this.loadYpListSettings.bind(this)
    this.findIndexOfChannels = this.findIndexOfChannels.bind(this)
    this.findIndexOfFavorites = this.findIndexOfFavorites.bind(this)
    this.checkElapsed = this.checkElapsed.bind(this)
    this.getFavoriteChannels = this.getFavoriteChannels.bind(this)
    this.fetchIndexTxt = this.fetchIndexTxt.bind(this)
    this.switchAutoUpdate = this.switchAutoUpdate.bind(this)
    this.selectTab = this.selectTab.bind(this)
    this.registFavorite = this.registFavorite.bind(this)
    this.state = {
      ypList: [],
      favorites: [],
      channels: [],
      sort: { key: config.get('sortKey'), orderBy: config.get('sortOrderBy') },
      autoUpdate: config.get('autoUpdate'),
      autoUpdateCount: 60,
      lastUpdateTime: moment().add(-59, 's'),
      currentTabIndex: 0,
      active: true
    }
    // 前回更新時のチャンネル一覧
    this.prevChannels = []
    this.bindEvents()
    this.loadFavorites()
    this.loadYpListSettings()
  }

  bindEvents(){
    // index.txtを取得時
    ipcRenderer.on('asyn-yp-reply', (event, replyYp) => {
      let newChannels = this.state.ypList[0].parseIndexTxt(replyYp['txt'])
      this.add(newChannels, (newChannel)=>{
        let now = moment()
        if(now.unix()-startedAt.unix()>30){
          // お気に入りにマッチ&&通知設定されてたら通知
          let favoriteIndex = this.findIndexOfFavorites(newChannel)
          if(favoriteIndex>=0&&this.state.favorites[favoriteIndex].notify){
            this.notify(newChannel.name, newChannel.genre+newChannel.detail)
          }
        }
      })
    })
    // メインウィンドウが非アクティブ時
    ipcRenderer.on('index-window-blur', (event)=>{
      this.setState({ active: false })
    })
    // メインウィンドウがアクティブ時
    ipcRenderer.on('index-window-focus', (event)=>{
      this.setState({ active: true })
    })
    // お気に入りウィンドウを閉じた時
    ipcRenderer.on('asyn-favorite-window-close-reply', (event)=>{
      this.loadFavorites()
    })
    // 設定ウィンドウを閉じた時
    ipcRenderer.on('asyn-settings-window-close-reply', (event)=>{
      this.loadYpListSettings()
      let sort = { key: config.get('sortKey'), orderBy: config.get('sortOrderBy') }
      this.setState({ sort: sort })
    })
  }

    // チャンネルを追加
  add(newChannels, call=()=>{}){
    var channels = this.state.channels
    for(let newChannel of newChannels){
      let channelIndex = this.findIndexOfPrevChannels(newChannel)
      // 新着チャンネル
      if(channelIndex<0) call(newChannel)
      channels.push(newChannel)
    }
    this.setState({ channels: channels })
  }

  // お気に入り設定を読み込む
  loadFavorites(call = ()=>{}){
    storage.get('favorites', (error, data)=>{
      if(Object.keys(data).length != 0){
        this.setState({ favorites: data })
      }
      call()
    })
  }

  // YP設定を読み込む
  loadYpListSettings(call = ()=>{}){
    storage.get('ypList', (error, data)=>{
      if(Object.keys(data).length != 0){
        let ypList = data.map((yp, index)=>{
          return new YP(yp.name, yp.url)
        })
        this.setState({ ypList: ypList })
      }
      call()
    })
  }

  // 最後の更新から30秒経過したか？
  checkElapsed(){
    let now = moment()
    // 差分秒
    let diffSec = Math.round(now.unix() - this.state.lastUpdateTime.unix())
    if(diffSec > 30){
      return true
    }else{
      return false
    }
  }

  // state.channels内のindex位置を返す
  findIndexOfChannels(channel){
    let index = -1
    for(let i=0; i < this.state.channels.length; i++){
      if(channel.key == this.state.channels[i].key){
        index = i
        break
      }
    }
    return index
  }

  // prevChannels内のindex位置を返す
  findIndexOfPrevChannels(channel){
    let index = -1
    for(let i=0; i < this.prevChannels.length; i++){
      if(channel.key == this.prevChannels[i].key){
        index = i
        break
      }
    }
    return index
  }

  // マッチするstate.favorites内のindex位置を返す
  findIndexOfFavorites(channel){
    let index = -1
    for(let i=0; i<this.state.favorites.length; i++){
      let favorite = this.state.favorites[i]
      // 検索文字欄が空の場合
      if(!favorite.pattern) continue
      let ptn = new RegExp(favorite.pattern, "i")
      // ptnにマッチする AND 検索対象に指定されているか
      if((channel.name.match(ptn)&&favorite.target.name)||
        (channel.genre.match(ptn)&&favorite.target.genre)||
        (channel.detail.match(ptn)&&favorite.target.detail)||
        (channel.comment.match(ptn)&&favorite.target.comment)||
        (channel.url.match(ptn)&&favorite.target.url)||
        (channel.tip.match(ptn)&&favorite.target.tip)){
        index = i
      }else{
        continue
      }
    }
    return index
  }

  // お気に入りチャンネル一覧を取得
  getFavoriteChannels(){
    let favoriteChannels = []
    for(let channel of this.state.channels){
      for(let favorite of this.state.favorites){
        // 検索文字欄が空の場合
        if(!favorite.pattern) continue
        let ptn = new RegExp(favorite.pattern, "i")
        // ptnにマッチする AND 検索対象に指定されているか
        if((channel.name.match(ptn)&&favorite.target.name)||
          (channel.genre.match(ptn)&&favorite.target.genre)||
          (channel.detail.match(ptn)&&favorite.target.detail)||
          (channel.comment.match(ptn)&&favorite.target.comment)||
          (channel.url.match(ptn)&&favorite.target.url)||
          (channel.tip.match(ptn)&&favorite.target.tip)){
          favoriteChannels.push(channel)
        }else{
          continue
        }
      }
    }
    // 重複を除去
    return favoriteChannels.filter((channel, index, self)=>{
      return self.indexOf(channel) === index
    })
  }

  // index.txtを取得
  fetchIndexTxt(){
    if(this.checkElapsed()){
      this.prevChannels = this.state.channels
      this.state.channels = []
      this.setState({ lastUpdateTime: moment() })
      for(var yp of this.state.ypList){
        ipcRenderer.send('asyn-yp', yp)
      }
    }else{
      let sec = 30 - Math.round(moment().unix() - this.state.lastUpdateTime.unix())
      // エラー通知
      this.notify("更新できませんでした", `30秒以上の間隔をあけて更新してくだい。\n次の更新まで、あと${sec}秒`)
    }
  }

  // 通知
  notify(title="", body=""){
    new Notification(title, {body: body})
  }

  // 設定を初期化
  initialize(){
    storage.clear(()=>{
      config.clear()
    })
  }

  // -------- HeaderUpdateButton --------
  // 自動更新ON/OFF
  switchAutoUpdate(){
    config.set('autoUpdate', !this.state.autoUpdate)
    this.setState({autoUpdate: !this.state.autoUpdate})
  }

  // -------------- TabBox --------------
  selectTab(tabIndex){
    this.setState({ currentTabIndex: tabIndex })
  }

  // ------------ ChannelItem ------------
  registFavorite(favoriteIndex, channelName){
    // 検索文字欄が空白でない場合は|を付与しない
    if(this.state.favorites[favoriteIndex].pattern){
      this.state.favorites[favoriteIndex].pattern += '|'
    }
    this.state.favorites[favoriteIndex].pattern += channelName
    this.setState({ favorites: this.state.favorites })
    storage.set('favorites', this.state.favorites)
  }

  render(){
    // お気に入りチャンネル一覧
    let favoriteChannels = this.getFavoriteChannels()
    let components = [
      {
        name: `すべて(${this.state.channels.length})`,
        component:
          <ChannelBox channels={this.state.channels} favorites={this.state.favorites} sort={this.state.sort}
            registFavorite={this.registFavorite} />
      },
      {
        name: `お気に入り(${favoriteChannels.length})`,
        component:
          <ChannelBox channels={favoriteChannels} favorites={this.state.favorites} sort={this.state.sort}
            registFavorite={this.registFavorite} />
      }
    ]
    let currentComponent = components[this.state.currentTabIndex].component

    return(
      <div id="index">
        <HeaderBox active={this.state.active} autoUpdate={this.state.autoUpdate}
         onClickAutoUpdate={this.switchAutoUpdate} onClickUpdate={this.fetchIndexTxt} />
        <TabBox components={components} currentTabIndex={this.state.currentTabIndex} selectTab={this.selectTab} />
        {currentComponent}
        <FooterBox autoUpdate={this.state.autoUpdate} autoUpdateCount={this.state.autoUpdateCount} lastUpdateTime={this.state.lastUpdateTime}
          onUpdate={this.fetchIndexTxt}/>
      </div>
    )
  }

}

ReactDOM.render(
  <Index />,
  document.getElementById('container')
)
