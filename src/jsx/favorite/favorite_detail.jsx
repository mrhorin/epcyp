import React from 'react'
import css from 'scss/style'

module.exports = class FavoriteDetail extends React.Component {

  constructor(props){
    super(props)
    this.onChangeFontColor = this.onChangeFontColor.bind(this)
    this.onChangeBgColor = this.onChangeBgColor.bind(this)
  }

  // 文字色
  onChangeFontColor(){
    this.props.onChangeColor(this.refs.fontColor, this.props.index)
  }

  // 背景色
  onChangeBgColor(){
    this.props.onChangeColor(this.refs.bgColor, this.props.index)
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
        <input type="text" ref="name" name="name" value={this.props.favorite.name}
         onChange={event=>{this.props.onChangeForm(event, this.props.index)}} />
        <label>検索文字(正規表現)</label>
        <input type="text" ref="pattern" name="pattern" value={this.props.favorite.pattern}
          onChange={event=>{this.props.onChangeForm(event, this.props.index)}} />
        <label>検索対象</label>
        <div id="favorite-detail-targets">
          <input name="name" type="checkbox" ref="targetName" value={this.props.favorite.target.name} checked={this.props.favorite.target.name}
            onChange={(event)=>{this.props.onChangeTarget(event.target, this.props.index)}} />名前
          <input name="genre" type="checkbox" ref="targetGenre" value={this.props.favorite.target.genre} checked={this.props.favorite.target.genre}
            onChange={(event)=>{this.props.onChangeTarget(event.target, this.props.index)}} />ジャンル
          <input name="detail" type="checkbox" ref="targetDetail" value={this.props.favorite.target.detail} checked={this.props.favorite.target.detail}
            onChange={(event)=>{this.props.onChangeTarget(event.target, this.props.index)}} />詳細
          <input name="comment" type="checkbox" ref="targetComment" value={this.props.favorite.target.comment} checked={this.props.favorite.target.comment}
            onChange={(event)=>{this.props.onChangeTarget(event.target, this.props.index)}} />コメント
          <input name="url" type="checkbox" ref="targetUrl" value={this.props.favorite.target.url} checked={this.props.favorite.target.url}
            onChange={(event)=>{this.props.onChangeTarget(event.target, this.props.index)}} />URL
          <input name="tip" type="checkbox" ref="targetTip" value={this.props.favorite.target.tip} checked={this.props.favorite.target.tip}
            onChange={(event)=>{this.props.onChangeTarget(event.target, this.props.index)}} />IP
        </div>
        <div id="favorite-detail-colors">
          <label>色設定</label>
          <div id="sample" style={sampleStyle}>Sample文字</div>
          <input id="font-color" ref="fontColor" name="fontColor" type="hidden" value={this.props.favorite.fontColor}
           onChange={this.onChangeFontColor} />
          <button className="btn btn-mini btn-default jscolor {valueElement:'font-color',styleElement:'font-color'}" onBlur={this.onChangeFontColor}>
            文字色
          </button>
          <input id="bg-color" ref="bgColor" name="bgColor" type="hidden" value={this.props.favorite.bgColor}
            onChange={this.onChangeBgColor} />
          <button className="btn btn-mini btn-default jscolor {valueElement:'bg-color',styleElement:'bg-color'}" onBlur={this.onChangeBgColor}>
            背景色
          </button>
        </div>
      </div>
    )
  }

}
