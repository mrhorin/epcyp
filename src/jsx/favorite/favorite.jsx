import React from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'
import Config from 'electron-config'
import storage from 'electron-json-storage'
import css from 'scss/style'
import RuleBox from 'jsx/rule/rule_box'
import FavoriteDetail from 'jsx/favorite/favorite_detail'

const config = new Config({
  defaults: {
    theme: 'light'
  }
})

class Favorite extends React.Component {

  constructor(props){
    super(props)
    this.onClickItem = this.onClickItem.bind(this)
    this.onChangeForm = this.onChangeForm.bind(this)
    this.onChangeTarget = this.onChangeTarget.bind(this)
    this.onClickDelete = this.onClickDelete.bind(this)
    this.onChangeColor = this.onChangeColor.bind(this)
    this.onChangeNotify = this.onChangeNotify.bind(this)
    this.add = this.add.bind(this)
    this.onClickUp = this.onClickUp.bind(this)
    this.onClickDown = this.onClickDown.bind(this)
    this.save = this.save.bind(this)
    let favorite = this.getDefaultFavorite()
    favorite.name = ""
    this.state = {
      theme: config.get('theme'),
      favorites: [favorite],
      current: 0
    }
    storage.get('favorites', (error, data)=>{
      if(Object.keys(data).length == 0){
        data = [this.getDefaultFavorite()]
      }
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
      },
      fontColor: "444444",
      bgColor: "ffffff",
      notify: false
    }
    return favorite
  }

  // favoritesのリストが存在するか
  hasFavorites() {
    return (
      (this.state.favorites.length > 0)
    )
  }

  onClickItem(index){
    this.setState({ current: index })
  }

  onChangeForm(event, index){
    this.state.favorites[index][event.target.name] = event.target.value
    this.setState({ favorites: this.state.favorites })
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

  onChangeNotify(target, index){
    // ON/OFFを切り替えて文字列をbooleanに変換
    let bool = false
    if(target.value == "true") bool = false
    if(target.value == "false") bool = true
    this.state.favorites[index][target.name] = bool
    this.setState({
      favorites: this.state.favorites
    })
  }

  onChangeColor(target, index){
    this.state.favorites[index][target.name] = target.value
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

  // favoritesのcurrentを上へ移動
  onClickUp(){
    let index = this.state.current
    if(index > 0){
      let a = this.state.favorites[index]
      let b = this.state.favorites[index-1]
      this.state.favorites.splice(index-1, 1, a)
      this.state.favorites.splice(index, 1, b)
      this.setState({
        favorites: this.state.favorites,
        current: index-1
      })
    }
  }

  // favoritesのcurrentを下へ移動
  onClickDown(){
    let index = this.state.current
    if(index < this.state.favorites.length-1){
      let a = this.state.favorites[index]
      let b = this.state.favorites[index+1]
      this.state.favorites.splice(index+1, 1, a)
      this.state.favorites.splice(index, 1, b)
      this.setState({
        favorites: this.state.favorites,
        current: index+1
      })
    }
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
    storage.set('favorites', this.state.favorites, (error)=>{
      this.close()
    })
  }

  // お気に入り登録ウィンドウを閉じる
  close(){
    ipcRenderer.send('asyn-favorite-window-close')
  }

  render() {
    return(
      <div id="favorite" className={this.state.theme}>
        <header className="toolbar toolbar-header">
          <h1 className="title">
            <span className="icon icon-star"></span>
            お気に入り
          </h1>
        </header>
        <div id="favorite-main">
          <RuleBox rules={this.state.favorites} current={this.state.current}
            onClickItem={this.onClickItem} onClickAdd={this.add} onClickDelete={this.onClickDelete}
            onClickUp={this.onClickUp} onClickDown={this.onClickDown} />
          {
            this.hasFavorites() &&
            <FavoriteDetail index={this.state.current} favorite={this.state.favorites[this.state.current]}
              onChangeNotify={this.onChangeNotify}
              onChangeForm={this.onChangeForm} onChangeTarget={this.onChangeTarget}
              onClickDelete={this.onClickDelete} onChangeColor={this.onChangeColor} />            
          }
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
