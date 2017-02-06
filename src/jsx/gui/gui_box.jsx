import React from 'react'

import GuiItem from 'jsx/gui/gui_item'

module.exports = class GuiBox extends React.Component{

  constructor(props){
    super(props)
  }

  render(){
    let guiItems = this.props.relays.map((relay, index)=>{
      return(
        <GuiItem key={relay.channelId} index={index} relay={relay} status={this.props.status}/>
      )
    })
    return(
      <div className="gui-box">
        <div className="gui-box-body">
          {guiItems}
        </div>
      </div>
    )
  }

}
