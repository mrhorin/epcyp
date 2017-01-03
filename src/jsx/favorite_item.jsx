import React from 'react'
import ReactDOM from 'react-dom'
import css from 'scss/style'

module.exports = class FavoriteItem extends React.Component {

  constructor(props){
    super(props)
    this.onChangeName = this.onChangeName.bind(this)
    this.onChangePattern = this.onChangePattern.bind(this)
    this.state = {
      name: this.props.favorite.name,
      pattern: this.props.favorite.pattern
    }
  }

  onChangeName(event){
    this.setState({ name: event.target.value })
    this.props.onChangeName(event.target.value, this.props.index)
  }

  onChangePattern(event){
    this.setState({ pattern: event.target.value })
    this.props.onChangePattern(event.target.value, this.props.index)
  }

  render(){
    return(
      <tr>
        <td className="favorite-item-name">
          <input type="text" ref="name" value={this.state.name} onChange={this.onChangeName} />
        </td>
        <td className="favorite-item-pattern">
          <input type="text" ref="pattern" value={this.state.pattern} onChange={this.onChangePattern} />
        </td>
      </tr>
    )
  }

}
