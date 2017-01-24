import React from 'react'

import GuiItem from 'jsx/gui/gui_item'

module.exports = class GuiBox extends React.Component{

  constructor(props){
    super(props)
    this.state = { current: -1 }
  }

  // ------------ GuiItem ------------
  activeGuiItem(index){
    if(this.props.relays.length > index){
      this.setState({ current: index })
    }else{
      this.setState({ current: -1 })
    }
  }

  render(){
    let guiItems = this.props.relays.map((relay, index)=>{
      return(
        <GuiItem
          key={relay.channelId} index={index} current={this.state.current} relay={relay}
          onClickItem={index=>{this.activeGuiItem(index)}} />
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
