import React from "react"
import ReactDOM from "react-dom"
import {ipcRenderer} from "electron"
import css from "scss/style"

class Favorite extends React.Component {

  constructor(props){
    super(props)
  }

  save(){
    console.log("OK")
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
