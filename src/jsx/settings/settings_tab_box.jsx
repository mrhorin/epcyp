import React from 'react'
import SettingsTabItem from 'jsx/settings/settings_tab_item'

module.exports = class SettingsTabBox extends React.Component {

  constructor(props){
    super(props)
    this.onClickTabItem = this.onClickTabItem.bind(this)
  }

  onClickTabItem(event, index){
    this.props.selectTab(index)
  }

  render(){
    let tabs = this.props.components.map((tab, index)=>{
      // アクティブなタブか
      let active = this.props.currentTabIndex==index ? true : false
      return(
        <SettingsTabItem key={index} index={index} name={tab.name} active={active}
          onClickTabItem={this.onClickTabItem} />
      )
    })

    return(
      <div className="tab-group">
        {tabs}
      </div>
    )
  }

}
