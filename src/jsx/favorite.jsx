import React from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'
import storage from 'electron-json-storage'
import css from 'scss/style'
import RuleBox from 'jsx/favorite/rule_box'
import RuleDetail from 'jsx/favorite/rule_detail'

class Favorite extends React.Component {

  constructor(props){
    super(props)
    this.onClickItem = this.onClickItem.bind(this)
    this.onChangeName = this.onChangeName.bind(this)
    this.onChangePattern = this.onChangePattern.bind(this)
    this.onChangeTarget = this.onChangeTarget.bind(this)
    this.onClickDelete = this.onClickDelete.bind(this)
    this.add = this.add.bind(this)
    this.save = this.save.bind(this)
    let favorite = this.getDefaultFavorite()
    favorite.name = ""
    this.state = {
      favorites: [favorite],
      current: 0
    }
    storage.get('favorites', (error, data)=>{
      if(!data) data = [this.getDefaultFavorite()]
      this.setState({ favorites: data })
    })
  }

  // お気に入り初期値ハッシュを取得
  getDefaultFavorite(){
    let favorite = {
      name: "noname",
      pattern: "",
      target: {
        name: true,
        genre: false,
        detail: false,
        comment: false,
        url: false,
        tip: false
      }
    }
    return favorite
  }

  onClickItem(index){
    this.setState({ current: index })
  }

  onChangeName(name, index){
    this.state.favorites[index]["name"] = name
    this.setState({
      favorites: this.state.favorites
    })
  }

  onChangePattern(pattern, index){
    this.state.favorites[index]["pattern"] = pattern
    this.setState({
      favorites: this.state.favorites
    })
  }

  onChangeTarget(target, index){
    // ON/OFFを切り替えて文字列をbooleanに変換
    let bool = false
    if(target.value == "true") bool = false
    if(target.value == "false") bool = true
    this.state.favorites[index]["target"][target.name] = bool
    this.setState({
      favorites: this.state.favorites
    })
  }

  onClickDelete(){
    this.state.favorites.splice(this.state.current, 1)
    this.setState({
      favorites: this.state.favorites,
      current: 0
    })
  }

  // お気に入りを追加
  add(){
    let favorite = this.getDefaultFavorite()
    this.state.favorites.push(favorite)
    this.setState({
      favorites: this.state.favorites
    })
  }

  save(){
    storage.set('favorites', this.state.favorites)
    this.close()
  }

  // お気に入り登録ウィンドウを閉じる
  close(){
    ipcRenderer.send('asyn-favorite-window-close')
  }

  render(){
    console.log(this.state)
    return(
      <div id="favorite">
        <header className="toolbar toolbar-header">
          <h1 className="title">
            <span className="icon icon-star"></span>
            お気に入り
          </h1>
        </header>
        <div id="favorite-main">
          <RuleBox favorites={this.state.favorites} current={this.state.current}
            onClickItem={this.onClickItem} onClickAdd={this.add} onClickDelete={this.onClickDelete} />
          <RuleDetail index={this.state.current} favorite={this.state.favorites[this.state.current]}
            onChangeName={this.onChangeName} onChangePattern={this.onChangePattern}
            onChangeTarget={this.onChangeTarget} onClickDelete={this.onClickDelete} />
          <div id="favorite-btn-group">
            <button id="favorite-ok" className="btn btn-primary" onClick={this.save}>OK</button>
            <button id="favorite-cancel" className="btn btn-default" onClick={this.close}>キャンセル</button>
          </div>
        </div>
      </div>
    )
  }

}

ReactDOM.render(
  <Favorite />,
  document.getElementById('container-favorite')
)
