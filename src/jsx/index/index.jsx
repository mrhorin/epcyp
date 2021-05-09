import React from 'react'
import ReactDOM from 'react-dom'
import { ipcRenderer } from 'electron'
import Config from 'electron-store'
import storage from 'electron-json-storage'
import moment from 'moment'
import _ from 'lodash'

import Peercast from 'js/peercaststation'
import Recorder from 'js/recorder'
import YP from 'js/yp'
import css from 'scss/style'

import HeaderBox from 'jsx/index/header_box'
import FooterBox from 'jsx/index/footer_box'
import TabBox from 'jsx/tab/tab_box'
import ChannelBox from 'jsx/channel/channel_box'
import GuiBox from 'jsx/gui/gui_box'
import RecordBox from 'jsx/record/record_box'

const config = new Config({
  defaults: { isAutoUpdate: false, sortKey: "listener", sortOrderBy: "desc", theme: 'light' }
})

class Index extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      ypList: [],
      channels: [],
      favorites: [],
      records: [],
      relays: [],
      status: { isFirewalled: false },
      searchWord: "",
      sort: { key: config.get('sortKey'), orderBy: config.get('sortOrderBy') },
      theme: config.get('theme'),
      isAutoUpdate: config.get('isAutoUpdate'),
      isMainWindowActive: true,
      isUnRead: false,
      autoUpdateCount: 0,
      lastUpdateTime: moment().add(-59, 's'),
      updateStatus: 'wait',
      currentTabIndex: 0,
    }
    this.bindEvents()
    this.loadFavorites()
    this.loadSettings()
  }

  bindEvents = () => {
    // index.txtを取得時
    ipcRenderer.on('asyn-yp-reply', (event, responses) => {
      let newChannels = _.flattenDeep(responses.map((res)=>{
        return this.state.ypList[0].parseIndexTxt(res.txt, res.url)
      }))
      if(newChannels.length>0){
        this.setChannels(newChannels, (newChannel)=>{
          // 新着チャンネルか
          let channelIndex = this.findIndexOfChannels(newChannel)
          if (channelIndex < 0) {
            // お気に入りチャンネルか
            let favoriteIndex = this.findIndexOfFavorites(newChannel)
            if (favoriteIndex >= 0) {
              // 新着時に通知
              if (this.state.favorites[favoriteIndex].isNotify) {
                this.notify(newChannel.name, newChannel.desc)
                if(!this.state.isMainWindowActive){
                  this.setState({ isUnRead: true })
                  ipcRenderer.send('asyn-set-trayicon', 'linux')
                }
              }
              // 自動録画
              if (this.state.favorites[favoriteIndex].isRec) {
                Recorder.start(newChannel)
              }
            }
          }
        })
      }else{
        this.setState({ autoUpdateCount: 60, updateStatus: 'wait' })
      }
    })
    // メインウィンドウを表示
    ipcRenderer.on('index-window-show', (event, tabIndex)=>{
      this.setState({ currentTabIndex: tabIndex })
    })
    // メインウィンドウが非アクティブ時
    ipcRenderer.on('index-window-blur', (event)=>{
      this.setState({ isMainWindowActive: false })
    })
    // メインウィンドウがアクティブ時
    ipcRenderer.on('index-window-focus', (event)=>{
      if(this.state.isUnRead){
        ipcRenderer.send('asyn-set-trayicon', 'darwin')
      }
      this.setState({ isMainWindowActive: true, isUnRead: false })
    })
    // お気に入りウィンドウを閉じた時
    ipcRenderer.on('asyn-favorite-window-close-reply', (event)=>{
      this.loadFavorites()
    })
    // 設定ウィンドウを閉じた時
    ipcRenderer.on('asyn-settings-window-close-reply', (event)=>{
      this.loadSettings()
    })
    // 検索ショートカット押下時
    ipcRenderer.on('shortcut-search', (event)=>{
      document.getElementById('search-word').focus()
    })
    // タブ左移動ショートカット押下時
    ipcRenderer.on('shortcut-tab-left', (event)=>{
      if (this.state.currentTabIndex <= 0) {
        this.setState({ currentTabIndex: 3 })
      }else{
        this.setState({ currentTabIndex: this.state.currentTabIndex - 1 })
      }
    })
    // タブ右移動ショートカット押下時
    ipcRenderer.on('shortcut-tab-right', (event)=>{
      if (this.state.currentTabIndex >= 3) {
        this.setState({ currentTabIndex: 0 })
      }else{
        this.setState({ currentTabIndex: this.state.currentTabIndex + 1 })
      }
    })
    // 録画開始
    ipcRenderer.on('start-record-reply', (event, channel) => {
      let info = { pid: "", channel: channel, time: "00:00:00", size: "0", progress: "connecting" }
      let recordIndex = this.findIndexOfRecs(channel)
      let records = this.state.records
      if (recordIndex >= 0) {
        records[recordIndex] = info
      } else {
        records.push(info)
      }
      this.setState({ records: records })
    })
    // 録画情報
    ipcRenderer.on('update-record-info', (event, channel, pid, data) => {
      data = data.split(/\n/)
      let regexes = {
        time: /(?<=out_time=)\d{2}\:\d{2}\:\d{2}/,
        size: /(?<=total_size=)\d+/,
        progress: /(?<=progress=).+/
      }
      let info = { pid: pid, channel: channel, time: "", size: "", progress: "" }
      for (let i = 0; i < data.length; i++){
        if (regexes.time.test(data[i])) info.time = data[i].match(regexes.time)[0]
        if (regexes.size.test(data[i])) info.size = data[i].match(regexes.size)[0]
        if (regexes.progress.test(data[i])) info.progress = data[i].match(regexes.progress)[0]
      }
      // 録画情報を更新
      let recordIndex = this.findIndexOfRecs(channel)
      let records = this.state.records
      if (recordIndex >= 0) {
        records[recordIndex] = info
      }
      this.setState({ records: records })
    })
    // 録画停止
    ipcRenderer.on('stop-record', (event, channel, pid, code) => {
      this.stopRecord(channel)
    })
  }

  // チャンネル情報をセット
  setChannels = (channels, call = () => { }) => {
    for(let channel of channels){
      call(channel)
    }
    this.setState({
      channels: channels,
      lastUpdateTime: moment(),
      autoUpdateCount: 60,
      updateStatus: 'wait'
    })
  }

  // チャンネルを並び替えて返す
  sortChannels = (channels) => {
    let key = this.state.sort.key
    return _.orderBy(channels, (item) => {
      // 数値化処理
      if(key=='time') return _.toInteger(item[key].replace(/:/, ""))
      if(key=='format') return item.getCharCode(item[key])
      if(key=='channel') item.getCharCode(item[key])
      return item[key]
    }, this.state.sort.orderBy)
  }

  // 設定を読み込む
  loadSettings = (call = () => { }) => {
    // YP
    storage.get('ypList', (error, data)=>{
      // ソート
      let sort = { key: config.get('sortKey'), orderBy: config.get('sortOrderBy') }
      let theme = config.get('theme')
      if (Object.keys(data).length == 0) {
        data = [
          { name: "SP", url: "http://bayonet.ddo.jp/sp/" },
          { name: "TP", url: "http://temp.orz.hm/yp/" }
        ]
      }
      let ypList = data.map((yp, index)=>{
        return new YP(yp.name, yp.url)
      })
      this.setState({
        sort: sort,
        theme: theme,
        ypList: ypList,
        currentTabIndex: 0
      })
    })
  }

  // お気に入り設定を読み込む
  loadFavorites = (call = () => { }) => {
    storage.get('favorites', (error, data)=>{
      if(Object.keys(data).length != 0){
        this.setState({ favorites: data })
      }
      call()
    })
  }

  // 最後の更新から30秒経過したか？
  checkElapsed = () => {
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
  findIndexOfChannels = (channel) => {
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
  findIndexOfFavorites = (channel) => {
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
        return i
      }else{
        continue
      }
    }
    return index
  }

  findIndexOfRecs = (channel) => {
    let index = -1
    for (let i = 0; i < this.state.records.length; i++){
      if (this.state.records[i].channel.id == channel.id) {
        index = i
        break
      }
    }
    return index
  }

  // チャンネル一覧を取得
  get channels(){
    return this.sortChannels(this.state.channels)
  }

  // お気に入りチャンネル一覧を取得
  get favoriteChannels(){
    let favoriteChannels = []
    for(let channel of this.channels){
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

  // チャンネルの検索結果一覧を所得
  get searchChannels(){
    if(!this.state.searchWord) return []
    let pattern = new RegExp(this.state.searchWord, 'gi')
    return _.filter(this.channels, (channel)=>{
      if(channel.name.match(pattern)||
         channel.genre.match(pattern)||
         channel.detail.match(pattern)||
         channel.comment.match(pattern)){
           return 1
         }
    })
  }

  // index.txtを取得
  fetchIndexTxt = () => {
    if(this.checkElapsed()&&this.state.updateStatus!='updating'){
      this.setState({ updateStatus: 'updating' })
      ipcRenderer.send('asyn-yp', this.state.ypList)
    }else if(this.state.updateStatus!='updating'){
      let sec = 30 - Math.round(moment().unix() - this.state.lastUpdateTime.unix())
      if(sec<0) sec = 30
      // エラー通知
      this.notify("更新できませんでした", `30秒以上の間隔をあけて更新してくだい。\n次の更新まで ${sec}秒`)
    }
  }

  // 更新処理を開始
  startUpdateTimer = () => {
    this.updateTimerId = setInterval(() => {
      this.updateRelaysPromise.then((relays) => {
        this.setState({ relays: relays.result })
      })
      this.updateStatusPromise.then((status) => {
        this.setState({ status: status.result })
      })
      this.updateCountPromise.then((count) => {
        this.setState({ autoUpdateCount: count })
      })
    }, 1000)
  }

  // 更新処理を停止
  stopUpdateTimer = () => {
    clearTimeout(this.updateTimerId)
  }

  // 録画開始
  startRecord = (channel) => {
    let recordIndex = this.findIndexOfRecs(channel)
    if (recordIndex < 0) {
      Recorder.start(channel)
    } else if (this.state.records[recordIndex].progress == "end") {
      Recorder.start(channel)
    } else {
      this.notify(`${channel.name} は既に録画中です`)
    }
  }

  stopRecord = (channel) => {
    let recordIndex = this.findIndexOfRecs(channel)
    if (recordIndex >= 0 && this.state.records[recordIndex].progress == "continue") {
      Recorder.stop(this.state.records[recordIndex].pid)
    } else if (recordIndex >= 0 && this.state.records[recordIndex].progress == "connecting") {
      let records = this.state.records
      records[recordIndex].progress = "end"
      this.setState({ records: records })
    }
  }

  // 自動更新カウントを更新
  get updateCountPromise() {
    return new Promise((resolve, reject)=>{
      if (this.state.isAutoUpdate && this.state.updateStatus == 'wait') {
        // 自動更新ON時の処理
        if(this.state.autoUpdateCount < 1){
          this.fetchIndexTxt()
          resolve(60)
        }else{
          resolve(this.state.autoUpdateCount-1)
        }
      }else{
         // 自動更新OFF時の処理
         resolve(60)
      }
    })
  }

  // リレー情報の更新
  get updateRelaysPromise() {
    return new Promise((resolve, reject)=>{
      Peercast.getChannels((res) => {
        if (res && res.status == 200 && res.data) {
          resolve(res.data)
        }else{
          reject()
        }
      })
    })
  }

  // PeerCast本体に関する情報を取得
  get updateStatusPromise() {
    return new Promise((resolve, reject)=>{
      Peercast.getStatus((res)=>{
        if (res && res.status == 200 && res.data) {
          resolve(res.data)
        }else{
          reject()
        }
      })
    })
  }

  // 通知
  notify = (title = "", body = "") => {
    new Notification(title, {body: body})
  }

  // 設定を初期化
  initialize = () => {
    storage.clear(()=>{ config.clear() })
  }

  // -------- HeaderUpdateButton --------
  // 自動更新ON/OFF
  switchAutoUpdate = () => {
    config.set('isAutoUpdate', !this.state.isAutoUpdate)
    this.setState({isAutoUpdate: !this.state.isAutoUpdate})
  }

  // ----------- HeaderSearch -----------
  // 検索ワードをセット
  setSearchWord = (word) => {
    this.setState({ searchWord: word, currentTabIndex: 2 })
  }

  // -------------- TabBox --------------
  selectTab = (tabIndex) => {
    if (this.state.currentTabIndex != tabIndex) {
      this.setState({ currentTabIndex: tabIndex })
    }
  }

  // ------------ ChannelBox ------------
  changeSort = (sortKey) => {
    let sortOrderBy = this.state.sort.orderBy == "asc" ? "desc" : "asc"
    config.set('sortKey', sortKey)
    config.set('sortOrderBy', sortOrderBy)
    this.setState({ sort: { key: sortKey, orderBy: sortOrderBy } })
  }

  // ------------ ChannelItem ------------
  // お気に入り登録
  registerFavorite = (favoriteIndex, channelName) => {
    // 正規表現の特殊文字をエスケープ
    channelName = channelName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    // 検索文字欄が空白でない場合は|を付与しない
    if(this.state.favorites[favoriteIndex].pattern){
      this.state.favorites[favoriteIndex].pattern += '|'
    }
    this.state.favorites[favoriteIndex].pattern += channelName
    storage.set('favorites', this.state.favorites, (err) => {
      this.loadFavorites()
    })
  }

  // ---------- Lifecycle Methods ----------
  componentDidMount(){
    this._isMounted = true
    this.startUpdateTimer()
  }

  componentWillUnmount(){
    this.stopUpdateTimer()
    this._isMounted = false
  }

  render(){
    let components = [
      {
        name: `すべて(${this.state.channels.length})`,
        component:
          <ChannelBox
            channels={this.channels}
            favorites={this.state.favorites}
            registerFavorite={this.registerFavorite}
            startRecord={this.startRecord}
            stopRecord={this.stopRecord}
            changeSort={this.changeSort} />
      },
      {
        name: `お気に入り(${this.favoriteChannels.length})`,
        component:
          <ChannelBox
            channels={this.favoriteChannels}
            favorites={this.state.favorites}
            registerFavorite={this.registerFavorite}
            startRecord={this.startRecord}
            stopRecord={this.stopRecord}
            changeSort={this.changeSort} />
      },
      {
        name: `検索(${this.searchChannels.length})`,
        component:
          <ChannelBox
            channels={this.searchChannels}
            favorites={this.state.favorites}
            registerFavorite={this.registerFavorite}
            startRecord={this.startRecord}
            stopRecord={this.stopRecord}
            changeSort={this.changeSort} />
      },
      {
        name: `録画(${this.state.records.length})`,
        component:
          <RecordBox
            records={this.state.records}
            startRecord={this.startRecord}
            stopRecord={this.stopRecord} />
      }
    ]
    // relaysが空値の瞬間があるので応急処置-------------
    let relays = this.state.relays
    if(relays==undefined||relays==null) relays = []
    // -------------------------------応急処置ここまで
    components.push({
      name: `リレー(${relays.length})`,
      component:
        <GuiBox relays={relays} status={this.state.status} />
    })
    let currentComponent = components[this.state.currentTabIndex].component

    return(
      <div id="index" className={this.state.theme}>
        <HeaderBox isAutoUpdate={this.state.isAutoUpdate}
         onClickAutoUpdate={this.switchAutoUpdate} onClickUpdate={this.fetchIndexTxt}
         setSearchWord={this.setSearchWord} />
        <TabBox components={components} currentTabIndex={this.state.currentTabIndex} selectTab={this.selectTab} />
        {currentComponent}
        <FooterBox isAutoUpdate={this.state.isAutoUpdate} autoUpdateCount={this.state.autoUpdateCount}
          lastUpdateTime={this.state.lastUpdateTime} updateStatus={this.state.updateStatus} />
      </div>
    )
  }

}

ReactDOM.render(
  <Index />,
  document.getElementById('container')
)
