import React from "react"

module.exports = class HeaderButton extends React.Component {

  render(){
    // photon.cssアイコンのクラス名
    const classNameIcon = `icon ${this.props.icon}`
    return(
      <button className={this.props.btnClass} onClick={this.props.onClickhandler}>
        <span className={classNameIcon}></span>
      </button>
    )
  }

}
