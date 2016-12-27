import React from "react"

module.exports = class HeaderButton extends React.Component {

  render(){
    // photon.cssアイコンのクラス名
    const classNameIcon = `icon ${this.props.icon}`
    return(
      <button className="btn btn-default" onClick={this.props.onClickUpdate}>
        <span className={classNameIcon}></span>
      </button>
    )
  }

}
