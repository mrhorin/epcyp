import React from 'react'

import GuiItem from 'jsx/gui/gui_item'

module.exports = class GuiBox extends React.Component{

  constructor(props){
    super(props)
  }

  render(){
    // darwin環境時
    let tableClass = global.process.platform == 'darwin' ? "darwin" : ""
    let guiItems = this.props.relays.map((relay, index)=>{
      return(
        <GuiItem
          key={relay.channelId} index={index} current={this.props.current} relay={relay}
          onClickItem={index=>{this.props.onClickItem(index)}} />
      )
    })
    return(
      <table className={tableClass}>
        <thead>
          <tr>
            <th className="gui-box-col1">チャンネル</th>
            <th className="gui-box-col2">リレー</th>
            <th className="gui-box-col3">kbps</th>
          </tr>
        </thead>
        <tbody>
          {guiItems}
        </tbody>
      </table>
    )
  }

}
