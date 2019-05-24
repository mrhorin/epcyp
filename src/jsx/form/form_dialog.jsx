import React from 'react'

export default class FormDialog extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className="form-group form-dialog">
        <label>{this.props.label}</label>
        <input type="text" value={this.props.value} onChange={this.props.onChange} />
        <button className="btn btn-mini btn-default" onClick={this.props.onClick}>
          参照
        </button>
      </div>
    )
  }

}
