import React from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'
import storage from 'electron-json-storage'
import css from 'scss/style'
import FavoriteBox from 'jsx/favorite_box'

class Favorite extends React.Component {

  constructor(props){
    super(props)
    this.onChangeName = this.onChangeName.bind(this)
    this.onChangePattern = this.onChangePattern.bind(this)
    this.save = this.save.bind(this)
    this.state = {
      favorites: []
    }
    storage.get('favorites', (error, data)=>{
      this.setState({ favorites: data })
    })
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

  save(){
    storage.set('favorites', this.state.favorites)
    this.close()
  }

  // お気に入り登録ウィンドウを閉じる
  close(){
    ipcRenderer.send('asyn-favorite-window-close')
  }

  render(){
    return(
      <div>
        <header className="toolbar toolbar-header">
          <h1 className="title">
            <span className="icon icon-star"></span>
            お気に入り
          </h1>
        </header>
        <div id="favorite-main">
          <FavoriteBox favorites={this.state.favorites}
            onChangeName={this.onChangeName} onChangePattern={this.onChangePattern} />
          <button id="favorite-ok" className="btn btn-default" onClick={this.save}>OK</button>
          <button id="favorite-cancel" className="btn btn-default" onClick={this.close}>キャンセル</button>
        </div>
      </div>
    )
  }

}

ReactDOM.render(
  <Favorite />,
  document.getElementById('container-favorite')
)
