import React from 'react'
import ReactDOM from 'react-dom'
import FooterCount from 'jsx/footer_count'

module.exports = class FooterBox extends React.Component {

  // hh:mmに変換
  toTimeFormat(date){
    let hour = date.getHours()
    if(hour<10) hour = '0'+hour
    let min = date.getMinutes()
    if(min<10) min = '0'+min
    return `${hour}:${min}`
  }

  render(){
    return(
      <footer className="toolbar toolbar-footer">
        <div className="footer-left">
          {this.toTimeFormat(this.props.lastUpdateTime)}
        </div>
        <FooterCount autoUpdate={this.props.autoUpdate} autoUpdateCount={this.props.autoUpdateCount} lastUpdateTime={this.props.lastUpdateTime}
          onUpdate={this.props.onUpdate}/>
      </footer>
    )
  }

}
