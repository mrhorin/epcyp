import React from 'react'
import ReactDOM from 'react-dom'
import FooterCount from 'jsx/index/footer_count'

module.exports = class FooterBox extends React.Component {


  render(){
    return(
      <footer className="toolbar toolbar-footer">
        <div className="footer-left">
          {this.props.lastUpdateTime.format("HH:mm")}
        </div>
        <FooterCount
          autoUpdate={this.props.autoUpdate}
          autoUpdateCount={this.props.autoUpdateCount}
          lastUpdateTime={this.props.lastUpdateTime}
          updateStatus={this.props.updateStatus} />
      </footer>
    )
  }

}
