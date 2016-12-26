import React from "react"

module.exports = class HeaderBox extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      update: false
    }
    this.onClickUpdate = this.onClickUpdate.bind(this)
  }

  // 更新ボタン押下時
  onClickUpdate(){
    this.props.fetchIndexTxt()
  }

  render(){
    return(
      <header className="header-box">
        <button id="header-box-update" onClick={this.onClickUpdate}>
          更新（{this.state.update ? "OFF" : "ON"}
        </button>
      </header>
    )
  }

}
