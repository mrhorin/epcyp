import React from "react"

module.exports = class GuiControl extends React.Component{

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className="gui-control btn-group">
        <button className="btn btn-default btn-mini">
          <span className="icon icon-play"></span>
        </button>
        <button className="btn btn-default  btn-mini">
          <span className="icon icon-stop"></span>
        </button>
        <button className="btn btn-default  btn-mini">
          <span className="icon icon-cw"></span>
        </button>
        <button className="btn btn-default btn-mini">
          <span className="icon icon-list"></span>
        </button>
      </div>
    )
  }

}
