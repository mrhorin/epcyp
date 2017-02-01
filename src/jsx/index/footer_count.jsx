import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

module.exports = class FooterCount extends React.Component {

  constructor(props){
    super(props)
    this.startUpdateTimer = this.startUpdateTimer.bind(this)
    this.state = {
      diffSec: this.props.autoUpdateCount
    }
    this.startUpdateTimer()
  }

  // 自動更新タイマーの開始
  startUpdateTimer(){
    this.countTimer = setInterval(()=>{
      if(this.props.autoUpdate){
        // 自動更新ON時の処理
        if(this.state.diffSec < 1){
          this.props.onUpdate()
          this.setState({ diffSec: this.props.autoUpdateCount })
        }else{
          let now = moment()
          // 最終更新時からの経過時間(秒)
          let diffSec = this.props.autoUpdateCount - (Math.round((now.unix() - this.props.lastUpdateTime.unix())))
          if(diffSec>=0) this.setState({ diffSec: diffSec })
        }
      }else{
        // 自動更新OFF時の処理
        if(this.state.diffSec != this.props.autoUpdateCount){
          this.setState({ diffSec: this.props.autoUpdateCount })
        }
      }
    }, 1000)
  }

  // mm:ssに変換
  toTimeFormat(secounds){
    let min = Math.floor((secounds / 60) % 60)
    if(min<10) min = `0${min}`
    let sec = Math.floor(secounds % 60)
    if(sec<10) sec = `0${sec}`
    return `${min}:${sec}`
  }

  render(){
    let counter
    if(this.props.updateStatus=='updating'){
      counter = "更新中"
    }else if(this.props.autoUpdate){
      counter = this.toTimeFormat(this.state.diffSec)
    }else{
      counter = "停止中"
    }
    return(
      <div className="footer-right">
        {counter}
      </div>
    )
  }
}
