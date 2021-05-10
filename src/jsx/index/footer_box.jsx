import React from 'react'
import ReactDOM from 'react-dom'
import FooterCount from 'jsx/index/footer_count'

export default class FooterBox extends React.Component {


  render() {
    let portStatus
    if (this.props.isFirewalled === null) {
      portStatus = "?"
    } else if (this.props.isFirewalled === true) {
      portStatus = "NG"
    }else if (this.props.isFirewalled === false) {
      portStatus = "OK"
    }
    return(
      <footer className="toolbar toolbar-footer">
        <div className="footer-icons">
          Port: {portStatus}
          {/* <span className="icon icon-megaphone"></span> */}
        </div>
        <FooterCount
          isAutoUpdate={this.props.isAutoUpdate}
          autoUpdateCount={this.props.autoUpdateCount}
          lastUpdateTime={this.props.lastUpdateTime}
          updateStatus={this.props.updateStatus} />
      </footer>
    )
  }

}
