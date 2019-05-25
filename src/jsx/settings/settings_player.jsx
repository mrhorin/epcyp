import React from 'react'

import RuleBox from 'jsx/rule/rule_box'
import SettingsPlayerDetail from 'jsx/settings/settings_player_detail'

export default class SettingsPlayer extends React.Component {

  constructor(props){
    super(props)
  }

  hasFormatList() {
    return (
      (this.props.formatList.length > 0)
    )
  }

  render(){
    return(
      <div id="settings-player">
        <RuleBox rules={this.props.formatList} current={this.props.currentFormatIndex}
          onClickItem={index => this.props.onClickItem(index)}
          onClickAdd={this.props.onClickAdd} onClickDelete={this.props.onClickDelete}
          onClickUp={this.props.onClickUp} onClickDown={this.props.onClickDown} />
        {
          this.hasFormatList() &&
          <SettingsPlayerDetail format={this.props.formatList[this.props.currentFormatIndex]}
            index={this.props.currentFormatIndex}
            onChangeFormat={(value, key) => this.props.onChangeFormat(value, key)}
            onClickDialog={(event, index)=> this.props.onClickDialog(event, index)} />
        }
      </div>
    )
  }

}
