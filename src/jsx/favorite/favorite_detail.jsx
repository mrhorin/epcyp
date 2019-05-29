import React from 'react'
import css from 'scss/style'

export default class FavoriteDetail extends React.Component {

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
         onChange={e=>{this.props.onChangeForm(e, this.props.index)}} />
        <label>検索文字(正規表現)</label>
        <input type="text" ref="pattern" name="pattern" value={this.props.favorite.pattern}
          onChange={e=>{this.props.onChangeForm(e, this.props.index)}} />
        <label>検索対象</label>
        <div id="favorite-detail-targets">
          <input name="name" type="checkbox" ref="targetName" value={this.props.favorite.target.name} checked={this.props.favorite.target.name}
            onChange={(e)=>{this.props.onChangeTarget(e.target, this.props.index)}} />
            <span onClick={e =>{this.props.onChangeTarget(this.refs.targetName, this.props.index)}}>名前</span>
          <input name="genre" type="checkbox" ref="targetGenre" value={this.props.favorite.target.genre} checked={this.props.favorite.target.genre}
            onChange={(e)=>{this.props.onChangeTarget(e.target, this.props.index)}} />
            <span onClick={e =>{this.props.onChangeTarget(this.refs.targetGenre, this.props.index)}}>ジャンル</span>
          <input name="detail" type="checkbox" ref="targetDetail" value={this.props.favorite.target.detail} checked={this.props.favorite.target.detail}
            onChange={(e)=>{this.props.onChangeTarget(e.target, this.props.index)}} />
            <span onClick={e =>{this.props.onChangeTarget(this.refs.targetDetail, this.props.index)}}>詳細</span>
          <input name="comment" type="checkbox" ref="targetComment" value={this.props.favorite.target.comment} checked={this.props.favorite.target.comment}
            onChange={(e)=>{this.props.onChangeTarget(e.target, this.props.index)}} />
            <span onClick={e =>{this.props.onChangeTarget(this.refs.targetComment, this.props.index)}}>コメント</span>
          <input name="url" type="checkbox" ref="targetUrl" value={this.props.favorite.target.url} checked={this.props.favorite.target.url}
            onChange={(e)=>{this.props.onChangeTarget(e.target, this.props.index)}} />
            <span onClick={e =>{this.props.onChangeTarget(this.refs.targetUrl, this.props.index)}}>URL</span>
          <input name="tip" type="checkbox" ref="targetTip" value={this.props.favorite.target.tip} checked={this.props.favorite.target.tip}
            onChange={(e)=>{this.props.onChangeTarget(e.target, this.props.index)}} />
            <span onClick={e =>{this.props.onChangeTarget(this.refs.targetTip, this.props.index)}}>IP</span>
        </div>
        <div id="favorite-detail-colors">
          <label>色設定</label>
          <div id="sample" style={sampleStyle}>SAMPLE文字</div>
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
        <div id="favorite-detail-notify">
          <label>オプション</label>
          <input ref="notify" name="notify" type="checkbox" value={this.props.favorite.notify} checked={this.props.favorite.notify}
            onChange={e=>{this.props.onChangeCheckbox(e.target, this.props.index)}} />
            <span onClick={e =>{this.props.onChangeCheckbox(this.refs.notify, this.props.index)}}>新着時に通知</span>
          <input ref="ignore" name="ignore" type="checkbox" value={this.props.favorite.ignore} checked={this.props.favorite.ignore}
            onChange={e=>{this.props.onChangeCheckbox(e.target, this.props.index)}} />
            <span onClick={e =>{this.props.onChangeCheckbox(this.refs.ignore, this.props.index)}}>無視リスト</span>
        </div>
      </div>
    )
  }

}
