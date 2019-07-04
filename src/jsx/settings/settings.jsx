import React from "react"
import ReactDOM from "react-dom"
import {ipcRenderer} from "electron"
import {remote} from 'electron'
import css from "scss/style"
import Config from 'electron-config'
import storage from 'electron-json-storage'
import TabBox from 'jsx/tab/tab_box'
import SettingsGeneral from 'jsx/settings/settings_general'
import SettingsPlayer from 'jsx/settings/settings_player'
import SettingsPeerCast from 'jsx/settings/settings_peercast'
import SettingsYP from 'jsx/settings/settings_yp'

const dialog = remote.dialog

class Settings extends React.Component {

  constructor(props){
    super(props)
    let yp = this.defaultYp
    let format = this.defaultFormat
    this.config = new Config({ default: this.defaultSettings })
    this.state = {
      ip: this.config.get('ip'),
      port: this.config.get('port'),
      bbs: this.config.get('bbs'),
      sort: { key: this.config.get('sortKey'), orderBy: this.config.get('sortOrderBy') },
      theme: this.config.get('theme'),
      peercast: this.config.get('peercast'),
      exitPeercast: this.config.get('exitPeercast'),
      useMono: this.config.get('useMono'),
      showGuiTab: this.config.get('showGuiTab'),
      fontSize: this.config.get('fontSize'),
      ypList: [yp],
      formatList: [format],
      currentTabIndex: 0,
      currentYpIndex: 0,
      currentFormatIndex: 0
    }
    storage.get('ypList', (error, data)=>{
      if(Object.keys(data).length != 0){
        this.setState({ ypList: data })
      }
    })
    storage.get('formatList', (error, data)=>{
      if(Object.keys(data).length != 0){
        this.setState({ formatList: data })
      }
    })
  }

  // 設定保存
  save = () => {
    this.config.set('ip', this.state.ip)
    this.config.set('port', this.state.port)
    this.config.set('bbs', this.state.bbs)
    this.config.set('sortKey', this.state.sort.key)
    this.config.set('sortOrderBy', this.state.sort.orderBy)
    this.config.set('theme', this.state.theme)
    this.config.set('peercast', this.state.peercast)
    this.config.set('exitPeercast', this.state.exitPeercast)
    this.config.set('useMono', this.state.useMono)
    this.config.set('showGuiTab', this.state.showGuiTab)
    this.config.set('fontSize', this.state.fontSize)
    storage.set('ypList', this.state.ypList, (error)=>{
      storage.set('formatList', this.state.formatList, (error)=>{
        this.close()
      })
    })
  }

  // 設定ウィンドウを閉じる
  close = () => {
    ipcRenderer.send('asyn-settings-window-close')
  }

  // 設定の初期化
  onClickInitialize = () => {
    let settings = this.defaultSettings
    if (this.state.currentTabIndex == 0) {
      // 全般
      this.setState({
        bbs: settings.bbs,
        fontSize: settings.fontSize,
        sort: { key: settings.sortKey, orderBy: settings.sortOrderBy },
        theme: settings.theme
      })
    } else if (this.state.currentTabIndex == 1) {
      // PeerCast
      this.setState({
        port: settings.port,
        ip: settings.ip,
        peercast: settings.peercast,
        useMono: settings.useMono,
        exitPeercast: settings.exitPeercast,
        showGuiTab: settings.showGuiTab
      })
    } else if (this.state.currentTabIndex == 2) {
      // YP
      this.setState({ ypList: [this.defaultYp] })
    } else if (this.state.currentTabIndex == 3) {
      // プレイヤー
      this.setState({ formatList: [this.defaultFormat] })
    }
  }

  // -------------- TabBox --------------
  selectTab = (index) => {
    this.setState({ currentTabIndex: index })
  }

  // ---------- SettingsGeneral ----------
  onChangeForm = (event, key) => {
    this.setState({ [key]: event.target.value })
  }

  onClickDialog = (key) => {
    let path = dialog.showOpenDialog()
    this.setState({ [key]: path[0] })
  }

  onChangeSort = (sort) => {
    this.setState({ sort: sort })
  }

  onChangeTheme = (theme) => {
    this.setState({ theme: theme })
  }

  // --------- SettingsPeerCast ----------
  onChangeCheckbox = (target) => {
    // ON/OFFを切り替えて文字列をbooleanに変換
    let bool = false
    if(target.value == "true") bool = false
    if(target.value == "false") bool = true
    this.setState({ [target.name]: bool })
  }

  // ------------ SettingsYP -------------
  selectYP = (index) => {
    this.setState({ currentYpIndex: index })
  }

  addYP = () => {
    let yp = this.defaultYp
    this.state.ypList.push(yp)
    this.setState({ ypList: this.state.ypList })
  }

  deleteYP = () => {
    let afterIndex = this.state.currentYpIndex - 1
    if(afterIndex<0) afterIndex = 0
    this.state.ypList.splice(this.state.currentYpIndex, 1)
    this.setState({
      ypList: this.state.ypList,
      currentYpIndex: afterIndex
    })
  }

  upYP = () => {
    let index = this.state.currentYpIndex
    if(index > 0){
      let a = this.state.ypList[index]
      let b = this.state.ypList[index-1]
      this.state.ypList.splice(index-1, 1, a)
      this.state.ypList.splice(index, 1, b)
      this.setState({
        ypList: this.state.ypList,
        currentYpIndex: index-1
      })
    }
  }

  downYP = () => {
    let index = this.state.currentYpIndex
    if(index < this.state.ypList.length-1){
      let a = this.state.ypList[index]
      let b = this.state.ypList[index+1]
      this.state.ypList.splice(index+1, 1, a)
      this.state.ypList.splice(index, 1, b)
      this.setState({
        ypList: this.state.ypList,
        currentYpIndex: index+1
      })
    }
  }

  get defaultYp(){
    return { name: "YP", url: "http://" }
  }

  get defaultSettings() {
    return {
      ip: '127.0.0.1',
      port: 7144,
      bbs: "",
      sortKey: "listener",
      sortOrderBy: "desc",
      theme: 'light',
      peercast: "",
      exitPeercast: true,
      useMono: false,
      showGuiTab: false,
      playerPath: '',
      playerArgs: '"$x"',
      fontSize: 12
    }
  }

  // --------- SettingsYPDetail ---------
  onChangeYP = (event, key) => {
    this.state.ypList[this.state.currentYpIndex][key] = event.target.value
    this.setState({ ypList: this.state.ypList })
  }

  // ------------ SettingsPlayer -------------
  selectFormat = (index) => {
    this.setState({ currentFormatIndex: index })
  }

  addFormat = () => {
    let format = this.defaultFormat
    this.state.formatList.push(format)
    this.setState({ formatList: this.state.formatList })
  }

  deleteFormat = () => {
    let afterIndex = this.state.currentFormatIndex - 1
    if(afterIndex<0) afterIndex = 0
    this.state.formatList.splice(this.state.currentFormatIndex, 1)
    this.setState({
      formatList: this.state.formatList,
      currentFormatIndex: afterIndex
    })
  }

  upFormat = () => {
    let index = this.state.currentFormatIndex
    if(index > 0){
      let a = this.state.formatList[index]
      let b = this.state.formatList[index-1]
      this.state.formatList.splice(index-1, 1, a)
      this.state.formatList.splice(index, 1, b)
      this.setState({
        formatList: this.state.formatList,
        currentFormatIndex: index-1
      })
    }
  }

  downFormat = () => {
    let index = this.state.currentFormatIndex
    if(index < this.state.formatList.length-1){
      let a = this.state.formatList[index]
      let b = this.state.formatList[index+1]
      this.state.formatList.splice(index+1, 1, a)
      this.state.formatList.splice(index, 1, b)
      this.setState({
        formatList: this.state.formatList,
        currentFormatIndex: index+1
      })
    }
  }

  get defaultFormat(){
    return { name: 'WMV|FLV', player: '', args: '"$x"' }
  }

  // --------- SettingsPlayerDetail ---------
  onChangeFormat = (value, key) => {
    this.state.formatList[this.state.currentFormatIndex][key] = value
    this.setState({ formatList: this.state.formatList })
  }

  onClickDialogFormat = (event, index) => {
    let path = dialog.showOpenDialog()
    this.state.formatList[index].player = path[0]
    this.setState({ formats: this.state.formatList })
  }

  render(){
    // 各タブ用コンポーネント
    let components = [
      {
        name: "全般",
        component:
          <SettingsGeneral
            bbs={this.state.bbs} sort={this.state.sort} theme={this.state.theme} fontSize={this.state.fontSize}
            onClickDialog={this.onClickDialog} onChangeForm={this.onChangeForm}
            onChangeTheme={this.onChangeTheme} onChangeSort={this.onChangeSort} />
      },
      {
        name: "PeerCast",
        component:
          <SettingsPeerCast
            ip={this.state.ip} port={this.state.port}
            peercast={this.state.peercast} exitPeercast={this.state.exitPeercast}
            useMono={this.state.useMono} showGuiTab={this.state.showGuiTab}
            onClickDialog={this.onClickDialog} onChangeForm={this.onChangeForm} onChangeCheckbox={this.onChangeCheckbox} />
      },
      {
        name: "YP",
        component:
          <SettingsYP ypList={this.state.ypList} currentYpIndex={this.state.currentYpIndex}
            onClickItem={this.selectYP} onClickAdd={this.addYP} onClickDelete={this.deleteYP}
            onClickUp={this.upYP} onClickDown={this.downYP}
            onChangeYP={this.onChangeYP} />
      },
      {
        name: "プレイヤー",
        component:
          <SettingsPlayer formatList={this.state.formatList} currentFormatIndex={this.state.currentFormatIndex}
            onClickItem={this.selectFormat} onClickAdd={this.addFormat} onClickDelete={this.deleteFormat}
            onClickUp={this.upFormat} onClickDown={this.downFormat} onClickDialog={this.onClickDialog}
            onClickDialog={this.onClickDialogFormat} onChangeFormat={this.onChangeFormat} />
      },
    ]
    // カレントコンポーネント
    let currentComponent = components[this.state.currentTabIndex].component

    return(
      <div id="settings" className={this.state.theme}>
        <header className="toolbar toolbar-header">
          <h1 className="title">
            <span className="icon icon-cog"></span>
            設定
          </h1>
        </header>
        <TabBox components={components} currentTabIndex={this.state.currentTabIndex}
          selectTab={this.selectTab} />
        <div id="settings-main">
          {currentComponent}
        </div>
        <div id="settings-btn-group">
          <button id="settings-ok" className="btn btn-primary" onClick={this.save}>OK</button>
          <button id="settings-cancel" className="btn btn-default" onClick={this.close}>キャンセル</button>
          <button id="settings-initialize" className="btn btn-default" onClick={this.onClickInitialize}>初期化</button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Settings />,
  document.getElementById('container-settings')
)
