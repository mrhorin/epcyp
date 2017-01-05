import React from 'react'
import RuleBox from 'jsx/rule/rule_box'

module.exports = class SettingsYP extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div id="settings-yp">
        <RuleBox rules={this.props.ypList} current={this.props.currentYpIndex}
          onClickItem={index => this.props.onClickItem(index)}
          onClickAdd={this.props.onClickAdd} onClickDelete={this.props.onClickDelete}
          onClickUp={this.props.onClickUp} onClickDown={this.props.onClickDown} />
      </div>
    )
  }

}
