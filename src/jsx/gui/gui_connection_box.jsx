import React from 'react'

import GuiConnectionItem from 'jsx/gui/gui_connection_item'

export default class GuiConnectionBox extends React.Component{

  constructor(props){
    super(props)
  }

  render(){
    let connectionItems = this.props.connections.map((conn, index) => {
      let keisen = index == this.props.connections.length - 1 ? "└" : "├"
      return(
        <GuiConnectionItem key={conn.connectionId} connection={conn}
          relay={this.props.relay} current={this.props.current} index={index} keisen={keisen} />
      )
    })
    return(
      <ul className="gui-connection-box">
        {connectionItems}
      </ul>
    )
  }

}
