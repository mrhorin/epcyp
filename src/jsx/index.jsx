import React from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'
import Config from 'electron-config'
import storage from 'electron-json-storage'
import css from 'scss/style'
import YP from 'js/yp'
import HeaderBox from 'jsx/header_box'
import TabBox from 'jsx/tab_box'
import ChannelBox from 'jsx/channel_box'
import FooterBox from 'jsx/footer_box'
const config = new Config({
  defaults: { autoUpdate: false }
})

class Index extends React.Component {

  constructor(props){
    super(props)
    this.switchAutoUpdate = this.switchAutoUpdate.bind(this)
    this.fetchIndexTxt = this.fetchIndexTxt.bind(this)
    this.reloadYpList = this.reloadYpList.bind(this)
    this.state = {
      ypList: [],
      channels: [],
      autoUpdate: config.get('autoUpdate'),
      autoUpdateCount: 60
    }
    // index.txtを取得時
    ipcRenderer.on('asyn-yp-reply', (event, replyYp) => {
      let newChannels = this.state.ypList[0].parseIndexTxt(replyYp['txt'])
      let channels = this.state.channels.concat(newChannels)
      this.setState({ channels: channels })
    })
    // お気に入りウィンドウを閉じた時
    ipcRenderer.on('asyn-favorite-window-close-reply', (event)=>{
      console.log('asyn-favorite-window-close-reply')
    })
    // 設定ウィンドウを閉じた時
    ipcRenderer.on('asyn-settings-window-close-reply', (event)=>{
      this.reloadYpList()
    })
    this.reloadYpList(()=>{ this.fetchIndexTxt() })
  }

  // 自動更新ON/OFF
  switchAutoUpdate(){
    config.set('autoUpdate', !this.state.autoUpdate)
    this.setState({autoUpdate: !this.state.autoUpdate})
  }

  // index.txtを取得
  fetchIndexTxt(){
    this.state.channels = []
    for(var yp of this.state.ypList){
      ipcRenderer.send('asyn-yp', yp)
    }
  }

  // YP設定を読み込む
  reloadYpList(call = ()=>{}){
    storage.get('ypList', (error, data)=>{
      let ypList = data.map((yp, index)=>{
        return new YP(yp.name, yp.url)
      })
      this.setState({ ypList: ypList })
      call()
    })
  }

  render(){
    return(
      <div id="index">
        <HeaderBox autoUpdate={this.state.autoUpdate} onClickAutoUpdate={this.switchAutoUpdate} onClickUpdate={this.fetchIndexTxt} />
        <TabBox />
        <ChannelBox channels={this.state.channels} />
        <FooterBox autoUpdate={this.state.autoUpdate} autoUpdateCount={this.state.autoUpdateCount} onUpdateHandler={this.fetchIndexTxt}/>
      </div>
    )
  }

}

ReactDOM.render(
  <Index />,
  document.getElementById('container')
)
