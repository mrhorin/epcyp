import React from 'react'
import css from 'scss/style'

module.exports = class FavoriteDetail extends React.Component {

  constructor(props){
    super(props)
    this.onChangeName = this.onChangeName.bind(this)
    this.onChangePattern = this.onChangePattern.bind(this)
    this.onChangeTarget = this.onChangeTarget.bind(this)
  }

  // 名前
  onChangeName(event){
    this.props.onChangeName(event.target.value, this.props.index)
  }

  // 検索文字
  onChangePattern(event){
    this.props.onChangePattern(event.target.value, this.props.index)
  }

  // 検索対象
  onChangeTarget(event){
    this.props.onChangeTarget(event.target, this.props.index)
  }

  render(){
    return(
      <div id="favorite-detail">
        <label>名前</label>
        <input type="text" ref="name" value={this.props.favorite.name} onChange={this.onChangeName} />
        <label>検索文字(正規表現)</label>
        <input type="text" ref="pattern" value={this.props.favorite.pattern} onChange={this.onChangePattern} />
        <label>検索対象</label>
        <div id="favorite-detail-targets">
          <input name="name" type="checkbox" ref="targetName" value={this.props.favorite.target.name} checked={this.props.favorite.target.name}
            onChange={this.onChangeTarget} />名前
          <input name="genre" type="checkbox" ref="targetGenre" value={this.props.favorite.target.genre} checked={this.props.favorite.target.genre}
            onChange={this.onChangeTarget} />ジャンル
          <input name="detail" type="checkbox" ref="targetDetail" value={this.props.favorite.target.detail} checked={this.props.favorite.target.detail}
            onChange={this.onChangeTarget} />詳細
          <input name="comment" type="checkbox" ref="targetComment" value={this.props.favorite.target.comment} checked={this.props.favorite.target.comment}
            onChange={this.onChangeTarget} />コメント
          <input name="url" type="checkbox" ref="targetUrl" value={this.props.favorite.target.url} checked={this.props.favorite.target.url}
            onChange={this.onChangeTarget} />URL
          <input name="tip" type="checkbox" ref="targetTip" value={this.props.favorite.target.tip} checked={this.props.favorite.target.tip}
            onChange={this.onChangeTarget} />IP
        </div>
      </div>
    )
  }

}
