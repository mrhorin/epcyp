import React from 'react'
import RuleBox from 'jsx/rule/rule_box'
import SettingsYPDetail from 'jsx/settings/settings_yp_detail'

export default class SettingsYP extends React.Component {

  constructor(props){
    super(props)
  }

  hasYpList() {
    return (
      (this.props.ypList.length > 0)
    )
  }

  render() {
    return(
      <div id="settings-yp">
        <RuleBox rules={this.props.ypList} current={this.props.currentYpIndex}
          onClickItem={index => this.props.onClickItem(index)}
          onClickAdd={this.props.onClickAdd} onClickDelete={this.props.onClickDelete}
          onClickUp={this.props.onClickUp} onClickDown={this.props.onClickDown} />
        {
          this.hasYpList() &&
          <SettingsYPDetail yp={this.props.ypList[this.props.currentYpIndex]} index={this.props.currentYpIndex}
            onChangeYP={(event, key) => this.props.onChangeYP(event, key)} />
        }
      </div>
    )
  }

}
