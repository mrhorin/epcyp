import React from "react"
import ReactDOM from "react-dom"
import {ipcRenderer} from "electron"
import {remote} from 'electron'
import css from "scss/style"
import Config from 'electron-config'
import storage from 'electron-json-storage'
import TabBox from 'jsx/tab/tab_box'
import SettingsGeneral from 'jsx/settings/settings_general'
import SettingsYP from 'jsx/settings/settings_yp'
const dialog = remote.dialog
const config = new Config({
  defaults: { port: 7144, player: "", bbs: "", sortKey: "listener", sortOrderBy: "desc" }
})

class Settings extends React.Component {

  constructor(props){
    super(props)
    this.save = this.save.bind(this)
    this.selectTab = this.selectTab.bind(this)
    // SettingsGeneral
    this.onChangeForm = this.onChangeForm.bind(this)
    this.onClickDialog = this.onClickDialog.bind(this)
    this.onChangeSort = this.onChangeSort.bind(this)
    // SettingsYP
    this.selectYP = this.selectYP.bind(this)
    this.addYP = this.addYP.bind(this)
    this.deleteYP = this.deleteYP.bind(this)
    this.upYP = this.upYP.bind(this)
    this.downYP = this.downYP.bind(this)
    // SettingsYPDetail
    this.onChangeYP = this.onChangeYP.bind(this)
    let yp = this.getDefaultYP()
    this.state = {
      port: config.get('port'),
      player: config.get('player'),
      bbs: config.get('bbs'),
      sort: { key: config.get('sortKey'), orderBy: config.get('sortOrderBy') },
      ypList: [yp],
      currentTabIndex: 0,
      currentYpIndex: 0,
    }
    storage.get('ypList', (error, data)=>{
      if(!data) data = [this.getDefaultFavorite()]
      this.setState({ ypList: data })
    })
  }

  // 設定保存
  save(){
    config.set('port', this.state.port)
    config.set('player', this.state.player)
    config.set('bbs', this.state.bbs)
    config.set('sortKey', this.state.sort.key)
    config.set('sortOrderBy', this.state.sort.orderBy)
    storage.set('ypList', this.state.ypList, (error)=>{
      this.close()
    })
  }

  // 設定ウィンドウを閉じる
  close(){
    ipcRenderer.send('asyn-settings-window-close')
  }

  // -------------- TabBox --------------
  selectTab(index){
    this.setState({ currentTabIndex: index })
  }

  // ---------- SettingsGeneral ----------
  onChangeForm(event, key){
    this.setState({ [key]: event.target.value })
  }

  onClickDialog(key){
    let path = dialog.showOpenDialog()
    this.setState({ [key]: path[0] })
  }

  onChangeSort(sort){
    this.setState({ sort: sort })
  }

  // ------------ SettingsYP -------------
  selectYP(index){
    this.setState({ currentYpIndex: index })
  }

  addYP(){
    let yp = this.getDefaultYP()
    this.state.ypList.push(yp)
    this.setState({ ypList: this.state.ypList })
  }

  deleteYP(){
    this.state.ypList.splice(this.state.currentYpIndex, 1)
    this.setState({
      ypList: this.state.ypList,
      currentYpIndex: this.state.currentYpIndex - 1
    })
  }

  upYP(){
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

  downYP(){
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

  getDefaultYP(){
    return { name: "YP", url: "http://" }
  }

  // --------- SettingsYPDetail ---------
  onChangeYP(event, key){
    this.state.ypList[this.state.currentYpIndex][key] = event.target.value
    this.setState({ ypList: this.state.ypList })
  }

  render(){
    // 各タブ用コンポーネント
    let components = [
      {
        name: "全般",
        component:
          <SettingsGeneral port={this.state.port} player={this.state.player} bbs={this.state.bbs} sort={this.state.sort}
            onClickDialog={this.onClickDialog} onChangeForm={this.onChangeForm} onChangeSort={this.onChangeSort}  />
      },
      {
        name: "YP",
        component:
          <SettingsYP ypList={this.state.ypList} currentYpIndex={this.state.currentYpIndex}
            onClickItem={this.selectYP} onClickAdd={this.addYP} onClickDelete={this.deleteYP}
            onClickUp={this.upYP} onClickDown={this.downYP}
            onChangeYP={this.onChangeYP} />
      }
    ]
    // カレントコンポーネント
    let currentComponent = components[this.state.currentTabIndex].component

    return(
      <div id="settings">
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
          <div id="settings-btn-group">
            <button id="settings-ok" className="btn btn-primary" onClick={this.save}>OK</button>
            <button id="settings-cancel" className="btn btn-default" onClick={this.close}>キャンセル</button>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Settings />,
  document.getElementById('container-settings')
)
