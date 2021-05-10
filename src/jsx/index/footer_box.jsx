import React from 'react'
import ReactDOM from 'react-dom'
import FooterCount from 'jsx/index/footer_count'

export default class FooterBox extends React.Component {


  render() {
    let portStatus
    if (this.props.isFirewalled === null) {
      portStatus = <span className="icon icon-help"></span>
    } else if (this.props.isFirewalled === true) {
      portStatus = <span className="icon icon-cancel"></span>
    }else if (this.props.isFirewalled === false) {
      portStatus = <span className="icon icon-check"></span>
    }
    return(
      <footer className="toolbar toolbar-footer">
        <div className="footer-icons">{portStatus}</div>
        <FooterCount
          isAutoUpdate={this.props.isAutoUpdate}
          autoUpdateCount={this.props.autoUpdateCount}
          lastUpdateTime={this.props.lastUpdateTime}
          updateStatus={this.props.updateStatus} />
      </footer>
    )
  }

}
