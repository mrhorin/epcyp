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
      <header className="toolbar toolbar-header">
        <h1 className="title">
          <span className="icon icon-megaphone"></span>
          epcyp
        </h1>
        <div className="toolbar-actions">
          <button className="btn btn-default" onClick={this.onClickUpdate}>
            <span className="icon icon-arrows-ccw"></span>
          </button>
        </div>
      </header>
    )
  }

}
