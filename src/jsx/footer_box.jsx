import React from "react"
import ReactDOM from "react-dom"
import FooterCount from "jsx/footer_count"

module.exports = class FooterBox extends React.Component {

  render(){
    return(
      <footer className="toolbar toolbar-footer">
        <FooterCount autoUpdate={this.props.autoUpdate} autoUpdateCount={this.props.autoUpdateCount} onUpdateHandler={this.props.onUpdateHandler}/>
      </footer>
    )
  }

}
