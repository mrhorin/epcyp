import React from 'react'

export default class RecordItem extends React.Component{

  constructor(props){
    super(props)
  }

  // バイト表記に変換
  convertToByte = (size) => {
    let digit = String(size).length
    if (digit > 9) {
      size = Number(size) * Math.pow(10.24, -9)
      // GBの時は少数第2位まで表示
      let sizeGB = Math.round(size*100) / 100
      size = sizeGB.toLocaleString() + " GB"
    }else if (digit > 6) {
      size = Number(size) *  Math.pow(10.24, -6)
      size = Math.round(size).toLocaleString() + " MB"
    }else if (digit > 3) {
      size = Number(size) *  Math.pow(10.24, -3)
      size = Math.round(size).toLocaleString() + " KB"
    } else {
      size = Number(size).toLocaleString() + "B"
    }
    return size
  }

  render() {
    return(
      <div className="record-item">
        <div className="record-item-col1">{ this.props.record.name }</div>
        <div className="record-item-col2">{ this.convertToByte(this.props.record.size) }</div>
        <div className="record-item-col3">{this.props.record.time}</div>
        <div className="record-item-col4">{this.props.record.progress}</div>
      </div>
    )
  }

}
