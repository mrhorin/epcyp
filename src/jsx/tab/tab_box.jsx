import React from 'react'
import TabItem from 'jsx/tab/tab_item'

module.exports = class TabBox extends React.Component {

  constructor(props){
    super(props)
    this.onClickTabItem = this.onClickTabItem.bind(this)
  }

  onClickTabItem(event, index){
    this.props.selectTab(index)
  }

  render(){
    // darwin環境時
    let tabs = this.props.components.map((tab, index)=>{
      // アクティブなタブか
      let active = this.props.currentTabIndex==index ? true : false
      return(
        <TabItem key={index} index={index} name={tab.name} active={active}
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
