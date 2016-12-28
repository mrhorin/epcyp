import React from "react"
import ReactDOM from "react-dom"

module.exports = class FooterBox extends React.Component {

  constructor(props){
    super(props)
    this.enableAutoUpdate = this.enableAutoUpdate.bind(this)
    this.disableAutoUpdate = this.disableAutoUpdate.bind(this)
    this.state = {
      updateCount: this.props.updateCount
    }
    this.enableAutoUpdate()
  }

  // 自動更新有効
  enableAutoUpdate(){
    this.countTimer = setInterval(()=>{
      if(this.state.updateCount < 1){
        this.props.onUpdateHandler()
        this.setState({ updateCount: this.props.updateCount })
      }else{
        this.setState({updateCount: this.state.updateCount -1})
      }
    }, 1000)
  }

  // 自動更新無効
  disableAutoUpdate(){
    clearInterval(this.countTimer)
    this.setState({ updateCount: this.props.updateCount })
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
    return(
      <footer className="toolbar toolbar-footer">
        <div className="footer-right">
          {this.toTimeFormat(this.state.updateCount)}
        </div>
      </footer>
    )
  }

}
