import React from 'react'

export default class SettingsYPDetail extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div id="settings-yp-detail">
        <div className="form-group">
          <label>名前</label>
          <input type="text" value={this.props.yp.name} onChange={event => this.props.onChangeYP(event, 'name')} />
        </div>
        <div className="form-group">
          <label>URL</label>
          <input type="text" value={this.props.yp.url} onChange={event => this.props.onChangeYP(event, 'url')} />
        </div>
      </div>
    )
  }

}
