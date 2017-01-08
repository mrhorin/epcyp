import React from 'react'

module.exports = class FormText extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className="form-group">
        <label>{this.props.label}</label>
        <input type="text" value={this.props.value} onChange={this.props.onChange} />
      </div>
    )
  }

}
