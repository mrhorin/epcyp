import React from 'react'

module.exports = class TabBox extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className="tab-group">
        <div className="tab-item">
          <span className="icon icon-cancel icon-close-tab"></span>
          すべて
        </div>
        <div className="tab-item active">
          <span className="icon icon-cancel icon-close-tab"></span>
          お気に入り
        </div>
      </div>
    )
  }

}
