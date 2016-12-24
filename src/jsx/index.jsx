import React from "react"
import ReactDOM from "react-dom"
import electron from "electron"
import css from "scss/style"
import YP from "coffee/yp"
const ipc = electron.ipcRenderer

// コンポーネント
class Index extends React.Component {

  render(){
    var sp = new YP("SP", "http://bayonet.ddo.jp/sp/index.txt")
    // index.txtを取得
    ipc.send('asyn-yp', sp.url)
    ipc.on('asyn-yp-reply', (event, txt) => {
      sp.parseIndexTxt(txt)
      console.log(sp)
    })
    return (
      <h1>React.jsテスト{sp.url}</h1>
    )
  }

}

// レンダリング
ReactDOM.render(
  <Index />, document.getElementById('container')
)
