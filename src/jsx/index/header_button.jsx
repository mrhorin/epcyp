import React from "react"

export default class HeaderButton extends React.Component {

  render(){
    // photon.cssアイコンのクラス名
    const classNameIcon = `icon ${this.props.icon}`
    return(
      <button className="btn btn-default btn-mini" onClick={this.props.onClickhandler}>
        <span className={classNameIcon}></span>
      </button>
    )
  }

}
