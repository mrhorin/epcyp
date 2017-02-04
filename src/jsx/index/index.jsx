import React from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'
import {shell} from 'electron'
import Config from 'electron-config'
import storage from 'electron-json-storage'
import moment from 'moment'
import _ from 'lodash'

import Peercast from 'js/peercaststation'
import YP from 'js/yp'
import css from 'scss/style'

import HeaderBox from 'jsx/index/header_box'
import FooterBox from 'jsx/index/footer_box'
import TabBox from 'jsx/tab/tab_box'
import ChannelBox from 'jsx/channel/channel_box'
import GuiBox from 'jsx/gui/gui_box'

const config = new Config({
  defaults: { autoUpdate: false, sortKey: "listener", sortOrderBy: "desc", showGuiTab: false }
})

class Index extends React.Component {

  constructor(props){
    super(props)
    this.bindEvents = this.bindEvents.bind(this)
    this.add = this.add.bind(this)
    this.loadSettings = this.loadSettings.bind(this)
    this.loadFavorites = this.loadFavorites.bind(this)
    this.findIndexOfChannels = this.findIndexOfChannels.bind(this)
    this.findIndexOfFavorites = this.findIndexOfFavorites.bind(this)
    this.checkElapsed = this.checkElapsed.bind(this)
    this.getFavoriteChannels = this.getFavoriteChannels.bind(this)
    this.fetchIndexTxt = this.fetchIndexTxt.bind(this)
    this.startUpdateRelays = this.startUpdateRelays.bind(this)
    this.switchAutoUpdate = this.switchAutoUpdate.bind(this)
    this.selectTab = this.selectTab.bind(this)
    this.registFavorite = this.registFavorite.bind(this)
    this.state = {
      ypList: [],
      favorites: [],
      channels: [],
      relays: [],
      showGuiTab: config.get('showGuiTab'),
      sort: { key: config.get('sortKey'), orderBy: config.get('sortOrderBy') },
      autoUpdate: config.get('autoUpdate'),
      autoUpdateCount: 60,
      lastUpdateTime: moment().add(-59, 's'),
      updateStatus: 'wait',
      currentTabIndex: 0,
      mainWindowActive: true
    }
    this.bindEvents()
    this.loadFavorites()
    this.loadSettings()
  }

  bindEvents(){
    // index.txtを取得時
    ipcRenderer.on('asyn-yp-reply', (event, ypList) => {
      let newChannels = _.flattenDeep(ypList.map((yp)=>{
        return(
          this.state.ypList[0].parseIndexTxt(yp.txt)
        )
      }))
      this.add(newChannels, (newChannel)=>{
        // 新着チャンネルか
        let channelIndex = this.findIndexOfChannels(newChannel)
        if(channelIndex<0){
          // お気に入りにマッチ&&通知設定されているか
          let favoriteIndex = this.findIndexOfFavorites(newChannel)
          if(favoriteIndex>=0&&this.state.favorites[favoriteIndex].notify){
            this.notify('★'+newChannel.name, newChannel.genre+newChannel.detail)
          }
        }
      })
    })
    // メインウィンドウが非アクティブ時
    ipcRenderer.on('index-window-blur', (event)=>{
      this.setState({ mainWindowActive: false })
    })
    // メインウィンドウがアクティブ時
    ipcRenderer.on('index-window-focus', (event)=>{
      this.setState({ mainWindowActive: true })
    })
    // お気に入りウィンドウを閉じた時
    ipcRenderer.on('asyn-favorite-window-close-reply', (event)=>{
      this.loadFavorites()
    })
    // 設定ウィンドウを閉じた時
    ipcRenderer.on('asyn-settings-window-close-reply', (event)=>{
      this.loadSettings()
    })
  }

  // チャンネルを追加
  add(channels, call=()=>{}){
    for(let channel of channels){
      call(channel)
    }
    this.setState({
      channels: channels,
      lastUpdateTime: moment(),
      updateStatus: 'wait'
    })
  }

  // 設定を読み込む
  loadSettings(call = ()=>{}){
    // YP
    storage.get('ypList', (error, data)=>{
      // ソート
      let sort = { key: config.get('sortKey'), orderBy: config.get('sortOrderBy') }
      let ypList = []
      if(Object.keys(data).length != 0){
        ypList = data.map((yp, index)=>{
          return new YP(yp.name, yp.url)
        })
      }
      this.setState({
        sort: sort,
        ypList: ypList,
        showGuiTab: config.get('showGuiTab'),
        currentTabIndex: 0
      })
    })
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
      if(channel.name == this.state.channels[i].name&&
         channel.id == this.state.channels[i].id){
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
    if(this.checkElapsed()&&this.state.updateStatus!='updating'){
      this.setState({ updateStatus: 'updating' })
      ipcRenderer.send('asyn-yp', this.state.ypList)
    }else{
      let sec = 30 - Math.round(moment().unix() - this.state.lastUpdateTime.unix())
      if(sec<0) sec = 30
      // エラー通知
      this.notify("更新できませんでした", `30秒以上の間隔をあけて更新してくだい。\n次の更新まで ${sec}秒`)
    }
  }

  // リレー情報の更新を開始
  startUpdateRelays(){
    Peercast.getChannels((err, res)=>{
      let relays = []
      if(res && res.status == 200 && !res.error && res.text){
        let json = JSON.parse(res.text)
        relays = json.result
      }
      if(this._isMounted){
        this.setState({ relays: relays })
        // 再帰呼び出し
        this.updateRelaysTimer = setTimeout(()=>{ this.startUpdateRelays() }, 1000)
      }
    })
  }

  // リレー情報の更新を停止
  stopUpdateRelays(){
    clearTimeout(this.updateRelaysTimer)
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
  // お気に入り登録
  registFavorite(favoriteIndex, channelName){
    // 検索文字欄が空白でない場合は|を付与しない
    if(this.state.favorites[favoriteIndex].pattern){
      this.state.favorites[favoriteIndex].pattern += '|'
    }
    this.state.favorites[favoriteIndex].pattern += channelName
    this.setState({ favorites: this.state.favorites })
    storage.set('favorites', this.state.favorites)
  }

  componentDidMount(){
    this._isMounted = true
    this.startUpdateRelays()
  }

  componentWillUnmount(){
    this.stopUpdateRelays()
    this._isMounted = false
  }

  render(){
    // お気に入りチャンネル一覧
    let favoriteChannels = this.getFavoriteChannels()
    let components = [
      {
        name: `すべて(${this.state.channels.length})`,
        component:
          <ChannelBox channels={this.state.channels}
            favorites={this.state.favorites} sort={this.state.sort}
            registFavorite={this.registFavorite} />
      },
      {
        name: `お気に入り(${favoriteChannels.length})`,
        component:
          <ChannelBox channels={favoriteChannels}
            favorites={this.state.favorites} sort={this.state.sort}
            registFavorite={this.registFavorite} />
      }
    ]
    if(this.state.showGuiTab){
      // relaysが空値の瞬間があるので応急処置-------------
      let relays = this.state.relays
      if(relays==undefined||relays==null) relays = []
      // -------------------------------応急処置ここまで
      components.push({
        name: `リレー(${relays.length})`,
        component:
          <GuiBox relays={relays} />
      })
    }
    let currentComponent = components[this.state.currentTabIndex].component

    return(
      <div id="index">
        <HeaderBox mainWindowActive={this.state.mainWindowActive} autoUpdate={this.state.autoUpdate}
         onClickAutoUpdate={this.switchAutoUpdate} onClickUpdate={this.fetchIndexTxt} />
        <TabBox components={components} currentTabIndex={this.state.currentTabIndex} selectTab={this.selectTab} />
        {currentComponent}
        <FooterBox autoUpdate={this.state.autoUpdate} autoUpdateCount={this.state.autoUpdateCount}
          lastUpdateTime={this.state.lastUpdateTime} updateStatus={this.state.updateStatus}
          onUpdate={this.fetchIndexTxt}/>
      </div>
    )
  }

}

ReactDOM.render(
  <Index />,
  document.getElementById('container')
)
