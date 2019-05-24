import React from 'react'
import css from 'scss/style'

export default class RuleItem extends React.Component {

  constructor(props){
    super(props)
    this.onClickItem = this.onClickItem.bind(this)
  }

  onClickItem(){
    this.props.onClickItem(this.props.index)
  }

  render(){
    let className = "rule-item"
    if(this.props.index == this.props.current) className += " rule-item-active"
    return(
      <div className={className} onClick={this.onClickItem}>{this.props.name}</div>
    )
  }

}
