import React from 'react'
import Config from 'electron-store'

import RecordItem from 'jsx/record/record_item.jsx'

const config = new Config({
  defaults: {
    fontSize: 13
  }
})

export default class RecordBox extends React.Component{

  constructor(props){
    super(props)
  }

  render() {
    let recordItems = this.props.records.map((record, index) => {
      return (
        <RecordItem key={index} record={record} fontSize={config.get('fontSize')} stopRecord={this.props.stopRecord}/>
      )
    })
    return(
      <div className="record-box">
        <div className="record-box-header">
          <div className="record-box-header-col1">チャンネル名</div>
          <div className="record-box-header-col2">容量</div>
          <div className="record-box-header-col3">時間</div>
          <div className="record-box-header-col4">状態</div>
        </div>
        <div className="record-box-body">{recordItems}</div>
      </div>
    )
  }

}
