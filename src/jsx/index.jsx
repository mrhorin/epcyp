import React from "react"
import ReactDOM from "react-dom"
import electron from "electron"
import css from "scss/style"
import Yp from "coffee/yp"
const ipc = electron.ipcRenderer

// コンポーネント
class Index extends React.Component {

  render(){
    var sp = new Yp("SP", "http://bayonet.ddo.jp/sp/index.txt")

    ipc.send('asynchronous-message', 'from render.')

    ipc.on('asynchronous-reply', (event, arg) => {
      console.log(arg)
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
