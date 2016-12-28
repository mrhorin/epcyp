import React from "react"
import ReactDOM from "react-dom"
import {ipcRenderer} from "electron"
import css from "scss/style"
import YP from "js/yp"
import HeaderBox from "jsx/header_box"
import ChannelBox from "jsx/channel_box"

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
    // index.txtを格納
    ipcRenderer.on('asyn-yp-reply', (event, replyYp) => {
      let newChannels = this.state.ypList[0].parseIndexTxt(replyYp['txt'])
      let channels = this.state.channels.concat(newChannels)
      channels = this.sortDESC(channels, 'listener')
      this.setState({
        channels: channels
      })
    })
    // this.fetchIndexTxt()
  }

  // index.txtを取得
  fetchIndexTxt(){
    this.state.channels = []
    for(var yp of this.state.ypList){
      ipcRenderer.send('asyn-yp', yp)
    }
  }

  // 昇順ソート
  sortASC(hash, key){
    hash.sort((a, b) =>{
      if(a[key] < b[key]) return -1;
      if(a[key] > b[key]) return 1;
      return 0;
    })
    return hash
  }

  // 降順ソート
  sortDESC(hash, key){
    hash.sort((a, b) =>{
      if(a[key] > b[key]) return -1;
      if(a[key] < b[key]) return 1;
      return 0;
    })
    return hash
  }

  render(){
    return(
      <div id="index">
        <HeaderBox onClickhandler={this.fetchIndexTxt} />
        <ChannelBox channels={this.state.channels} />
      </div>
    )
  }

}

ReactDOM.render(
  <Index />,
  document.getElementById('container')
)
