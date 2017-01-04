import React from 'react'
import SettingsTabItem from 'jsx/settings/settings_tab_item'

module.exports = class SettingsTabBox extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    let tabs = this.props.components.map((tab, index)=>{
      // アクティブなタブか
      let active = this.props.currentTabIndex==index ? true : false
      return(
        <SettingsTabItem key={index} name={tab.name} active={active} />
      )
    })

    return(
      <div className="tab-group">
        {tabs}
      </div>
    )
  }

}
