import React from "react"
import ReactDOM from "react-dom"
import electron from "electron"
import css from "scss/style"
import YP from "coffee/yp"
import HeaderBox from "jsx/header_box"
import ChannelBox from "jsx/channel_box"
const ipcRenderer = electron.ipcRenderer

class Index extends React.Component {

  constructor(props){
    super(props)
    this.fetchIndexTxt = this.fetchIndexTxt.bind(this)
    this.state = {
      ypList: [
        new YP("SP", "http://bayonet.ddo.jp/sp/index.txt"),
        new YP("TP", "http://temp.orz.hm/yp/index.txt")
      ],
      channels: []
    }
    ipcRenderer.on('asyn-yp-reply', (event, replyYp) => {
      // 取得したチャンネル一覧
      var newChannels = this.state.ypList[0].parseIndexTxt(replyYp['txt'])
      this.setState({
        channels: this.state.channels.concat(newChannels)
      })
      // console.log(this.state.channels)
    })
    this.fetchIndexTxt()
  }

  // index.txtを取得
  fetchIndexTxt(){
    this.state.channels = []
    for(var yp of this.state.ypList){
      ipcRenderer.send('asyn-yp', yp)
    }
  }

  render(){
    return(
      <div id="index">
        <HeaderBox fetchIndexTxt={this.fetchIndexTxt} />
        <ChannelBox channels={this.state.channels} />
      </div>
    )
  }

}

ReactDOM.render(
  <Index />,
  document.getElementById('container')
)
