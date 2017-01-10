import React from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'
import {shell} from 'electron'
import Config from 'electron-config'
import storage from 'electron-json-storage'
import css from 'scss/style'
import YP from 'js/yp'
import HeaderBox from 'jsx/header_box'
import TabBox from 'jsx/tab/tab_box'
import ChannelBox from 'jsx/channel_box'
import FooterBox from 'jsx/footer_box'
const config = new Config({
  defaults: { autoUpdate: false, sortKey: "listener", sortOrderBy: "desc" }
})

class Index extends React.Component {

  constructor(props){
    super(props)
    this.switchAutoUpdate = this.switchAutoUpdate.bind(this)
    this.fetchIndexTxt = this.fetchIndexTxt.bind(this)
    this.loadFavorites = this.loadFavorites.bind(this)
    this.loadYpList = this.loadYpList.bind(this)
    this.getFavoriteChannels = this.getFavoriteChannels.bind(this)
    this.selectTab = this.selectTab.bind(this)
    this.registFavorite = this.registFavorite.bind(this)
    this.state = {
      ypList: [],
      channels: [],
      favorites: [],
      sort: { key: config.get('sortKey'), orderBy: config.get('sortOrderBy') },
      autoUpdate: config.get('autoUpdate'),
      autoUpdateCount: 60,
      lastUpdateTime: new Date(0),
      currentTabIndex: 0
    }
    // index.txtを取得時
    ipcRenderer.on('asyn-yp-reply', (event, replyYp) => {
      let newChannels = this.state.ypList[0].parseIndexTxt(replyYp['txt'])
      let channels = this.state.channels.concat(newChannels)
      this.setState({ channels: channels })
    })
    // お気に入りウィンドウを閉じた時
    ipcRenderer.on('asyn-favorite-window-close-reply', (event)=>{
      this.loadFavorites()
    })
    // 設定ウィンドウを閉じた時
    ipcRenderer.on('asyn-settings-window-close-reply', (event)=>{
      this.loadYpList()
      let sort = { key: config.get('sortKey'), orderBy: config.get('sortOrderBy') }
      this.setState({ sort: sort })
    })
    this.loadFavorites()
    this.loadYpList()
  }

  // index.txtを取得
  fetchIndexTxt(){
    let now = new Date()
    // 差分秒
    let diffSec = (now.getTime() - this.state.lastUpdateTime.getTime())/1000
    // 最後の更新時から60秒経過しているか
    if(diffSec >= 60){
      this.setState({ lastUpdateTime: new Date() })
      this.state.channels = []
      for(var yp of this.state.ypList){
        ipcRenderer.send('asyn-yp', yp)
      }
    }else{
      // エラー音を再生
      shell.beep()
    }
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
  loadYpList(call = ()=>{}){
    storage.get('ypList', (error, data)=>{
      let ypList = data.map((yp, index)=>{
        return new YP(yp.name, yp.url)
      })
      this.setState({ ypList: ypList })
      call()
    })
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
        <HeaderBox autoUpdate={this.state.autoUpdate} onClickAutoUpdate={this.switchAutoUpdate} onClickUpdate={this.fetchIndexTxt} />
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
