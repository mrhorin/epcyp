import React from 'react'

module.exports = class SettingsTabBox extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className="tab-group">
        <div className="tab-item active">
          基本
        </div>
        <div className="tab-item">
          YP
        </div>
      </div>
    )
  }

}
