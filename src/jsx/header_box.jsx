import React from "react"
import HeaderButton from "jsx/header_button.jsx"

module.exports = class HeaderBox extends React.Component {

  constructor(props){
    super(props)
    this.onClickUpdate = this.onClickUpdate.bind(this)
  }

  // 更新ボタン押下時
  onClickUpdate(){
    this.props.fetchIndexTxt()
  }

  render(){
    return(
      <header className="toolbar toolbar-header">
        <h1 className="title">
          <span className="icon icon-megaphone"></span>
          epcyp
        </h1>
        <div className="toolbar-actions">
          <HeaderButton key={1} icon={"icon-arrows-ccw"} onClickUpdate={this.onClickUpdate}/>
        </div>
      </header>
    )
  }

}
