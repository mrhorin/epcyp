import React from 'react'

import GuiConnectionItem from 'jsx/gui/gui_connection_item'

module.exports = class GuiConnectionBox extends React.Component{

  constructor(props){
    super(props)
  }

  render(){
    let connectionItems = this.props.connections.map((conn, index)=>{
      return(
        <GuiConnectionItem key={conn.connectionId} connection={conn}
          current={this.props.current} index={index}
          onClickItem={index=>{this.props.onClickItem(index)}}  />
      )
    })
    return(
      <ul className="gui-connection-box">
        {connectionItems}
      </ul>
    )
  }

}
