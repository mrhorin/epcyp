import React from 'react'
import css from 'scss/style'

module.exports = class FavoriteDetail extends React.Component {

  constructor(props){
    super(props)
    this.onChangeName = this.onChangeName.bind(this)
    this.onChangePattern = this.onChangePattern.bind(this)
    this.onChangeTarget = this.onChangeTarget.bind(this)
    this.onChangeFontColor = this.onChangeFontColor.bind(this)
    this.onChangeBgColor = this.onChangeBgColor.bind(this)
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

  // 文字色
  onChangeFontColor(){
    this.props.onChangeFontColor(this.refs.fontColor.value, this.props.index)
  }

  // 背景色
  onChangeBgColor(){
    this.props.onChangeBgColor(this.refs.bgColor.value, this.props.index)
  }

  render(){
    // sample文字用CSS
    let sampleStyle = {
      color: "#"+this.props.favorite.fontColor,
      background: "#"+this.props.favorite.bgColor
    }
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
        <div id="favorite-detail-colors">
          <label>色設定</label>
          <div id="sample" style={sampleStyle}>Sample文字</div>
          <input id="font-color" ref="fontColor" type="hidden" value={this.props.favorite.fontColor} onChange={this.onChangeFontColor} />
          <button className="btn btn-mini btn-default jscolor {valueElement:'font-color',styleElement:'font-color'}" onBlur={this.onChangeFontColor}>
            文字色
          </button>
          <input id="bg-color" ref="bgColor" type="hidden" value={this.props.favorite.bgColor} onChange={this.onChangeBgColor} />
          <button className="btn btn-mini btn-default jscolor {valueElement:'bg-color',styleElement:'bg-color'}" onBlur={this.onChangeBgColor}>
            背景色
          </button>
        </div>
      </div>
    )
  }

}
