import React from 'react'

module.exports = class TabBox extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className="tab-group">
        <div className="tab-item active">
          すべて
        </div>
        <div className="tab-item">
          お気に入り
        </div>
      </div>
    )
  }

}
