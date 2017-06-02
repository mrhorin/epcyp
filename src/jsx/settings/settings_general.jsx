import React from 'react'
import FormText from 'jsx/form/form_text'
import FormDialog from 'jsx/form/form_dialog'

module.exports = class SettingsGeneral extends React.Component {

  constructor(props){
    super(props)
    this.onChangeSort = this.onChangeSort.bind(this)
  }

  onChangeSort(){
    let sort = { key: this.refs.sortKey.value, orderBy: this.refs.sortOrderBy.value }
    this.props.onChangeSort(sort)
  }

  render(){
    return(
      <div id="settings-general">
        <FormDialog label={"BBSブラウザ"} value={this.props.bbs}
          onChange={e => this.props.onChangeForm(e, 'bbs')} onClick={e => this.props.onClickDialog('bbs')} />
        <div id="settings-font" className="form-group">
          <label>フォントサイズ</label>
          <input type="number" value={this.props.fontSize} min="1"
           onChange={e => this.props.onChangeForm(e, 'fontSize')} />
        </div>
        <div id="settings-sort" className="form-group">
          <label>チャンネル一覧</label>
          <select ref="sortKey" onChange={this.onChangeSort} value={this.props.sort.key}>
            <option value="listener">リスナー数</option>
            <option value="relay">リレー数</option>
            <option value="time">配信時間</option>
            <option value="kbps">kbps</option>
            <option value="format">フォーマット</option>
          </select>
          <span style={ {margin: '0px 10px'} }>で</span>
          <select ref="sortOrderBy" onChange={this.onChangeSort} value={this.props.sort.orderBy}>
            <option value="desc">降順</option>
            <option value="asc">昇順</option>
          </select>
        </div>
      </div>
    )
  }

}
