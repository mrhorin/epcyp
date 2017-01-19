import React from "react"

module.exports = class GuiBox extends React.Component{

  constructor(props){
    super(props)
  }

  render(){
    return(
      <table className={tableClass}>
        <thead>
          <tr>
            <th className="channel-box-col1">チャンネル詳細</th>
            <th className="channel-box-col2">リスナー</th>
            <th className="channel-box-col3">kbps</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    )
  }

}
