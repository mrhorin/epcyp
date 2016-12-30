import React from 'react'
import ReactDOM from 'react-dom'

module.exports = class FooterCount extends React.Component {

  constructor(props){
    super(props)
    this.startUpdateTimer = this.startUpdateTimer.bind(this)
    this.state = {
      autoUpdateCount: this.props.autoUpdateCount
    }
    this.startUpdateTimer()
  }

  // 自動更新タイマーの開始
  startUpdateTimer(){
    this.countTimer = setInterval(()=>{
      if(this.props.autoUpdate){
        // 自動更新ON時の処理
        if(this.state.autoUpdateCount < 1){
          this.props.onUpdateHandler()
          this.setState({ autoUpdateCount: this.props.autoUpdateCount })
        }else{
          this.setState({autoUpdateCount: this.state.autoUpdateCount -1})
        }
      }else{
        // 自動更新OFF時の処理
        if(this.state.autoUpdateCount != this.props.autoUpdateCount){
          this.setState({ autoUpdateCount: this.props.autoUpdateCount })
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
    let counter;
    if(this.props.autoUpdate){
      counter = this.toTimeFormat(this.state.autoUpdateCount)
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
