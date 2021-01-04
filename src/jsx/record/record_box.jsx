import React from 'react'

import RecordItem from 'jsx/record/record_item.jsx'

export default class RecordBox extends React.Component{

  constructor(props){
    super(props)
  }

  render() {
    let recordItems = this.props.records.map((record, index) => {
      return (
        <RecordItem key={index} record={record} />
      )
    })
    return(
      <div className="record-box">
        <div className="record-box-header">
          <div className="record-box-header-col1">チャンネル名</div>
          <div className="record-box-header-col2">容量</div>
          <div className="record-box-header-col3">録画時間</div>
        </div>
        <div className="record-box-body">{recordItems}</div>
      </div>
    )
  }

}
