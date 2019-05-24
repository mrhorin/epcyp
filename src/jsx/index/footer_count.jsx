import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

export default class FooterCount extends React.Component {

  constructor(props){
    super(props)
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
    }else if(this.props.isAutoUpdate){
      counter = this.toTimeFormat(this.props.autoUpdateCount)
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
