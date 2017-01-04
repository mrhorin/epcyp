import React from 'react'

module.exports = class SettingsTabItem extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    let className = this.props.active ? "tab-item" : "tab-item active"
    return(
        <div className={className}>
          {this.props.name}
        </div>
    )
  }

}
