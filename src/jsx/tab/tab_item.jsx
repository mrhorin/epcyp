import React from 'react'

export default class TabItem extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    let className = this.props.active ? "tab-item active" : "tab-item"
    return(
      <div className={className} onClick={event => this.props.onClickTabItem(event, this.props.index)}>
        {this.props.name}
      </div>
    )
  }

}
