import React from 'react'
import ReactDOM from 'react-dom'
import css from 'scss/style'
import FavoriteItem from 'jsx/favorite_item'

module.exports = class FavoriteBox extends React.Component {

  constructor(props){
    super(props)
    this.onChangeName = this.onChangeName.bind(this)
    this.onChangePattern = this.onChangePattern.bind(this)
    this.onClickDelete = this.onClickDelete.bind(this)
  }

  onChangeName(name, index){
    this.props.onChangeName(name, index)
  }

  onChangePattern(pattern, index){
    this.props.onChangePattern(pattern, index)
  }

  onClickDelete(index){
    this.props.onClickDelete(index)
  }

  render(){
    let favoriteItems = this.props.favorites.map((favorite, index)=>{
      return(
        <FavoriteItem key={index} index={index} favorite={favorite}
          onChangeName={this.onChangeName} onChangePattern={this.onChangePattern} onClickDelete={this.onClickDelete} />
      )
    })
    return(
      <div id="favorite-box">
        <table id="table-favorites">
          <thead>
            <tr>
              <th className="favorite-item-name">名前</th>
              <th className="favorite-item-pattern">検索文字(正規表現)</th>
              <th className="favorite-item-btn-group">処理</th>
            </tr>
          </thead>
          <tbody>
            {favoriteItems}
          </tbody>
        </table>
      </div>
    )
  }

}
