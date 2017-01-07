import React from 'react'

module.exports = class SettingsGeneral extends React.Component {

  constructor(props){
    super(props)
    this.onChangeSort = this.onChangeSort.bind(this)
  }

  onChangeSort(){
    this.props.onChangeSort(this.refs.sortKey.value, this.refs.sortOrderBy.value)
  }

  render(){
    return(
      <div id="settings-general">
        <div className="form-group">
          <label>ポート番号</label>
          <input type="text" ref="port" value={this.props.port} onChange={e => this.props.onChangeForm(e, 'port')} />
        </div>
        <div className="form-group">
          <label>再生プレイヤー</label>
          <input id="settings-player" type="text" ref="player" value={this.props.player}
            onChange={e => this.props.onChangeForm(e, 'player')} />
          <button id="settings-player-dialog" className="btn btn-mini btn-default" onClick={e => this.props.onClickDialog('player')}>
            参照
          </button>
        </div>
        <div className="form-group">
          <label>BBSブラウザ</label>
          <input id="settings-bbs" type="text" ref="bbs" value={this.props.bbs}
            onChange={e => this.props.onChangeForm(e, 'bbs')} />
          <button id="settings-bbs-dialog" className="btn btn-mini btn-default" onClick={e => this.props.onClickDialog('bbs')}>
            参照
          </button>
        </div>
        <div id="settings-sort" className="form-group">
          <label>チャンネル一覧ソート</label>
          <select ref="sortKey" onChange={this.onChangeSort} value={this.props.sort}>
            <option value="listener">リスナー数</option>
            <option value="relay">リレー数</option>
            <option value="time">配信時間</option>
            <option value="kbps">kbpsト</option>
            <option value="format">フォーマット</option>
          </select>
          <span style={ {margin: '0px 10px'} }>で</span>
          <select ref="sortOrderBy" onChange={this.onChangeSort} value={this.props.orderBy}>
            <option value="desc">降順</option>
            <option value="asc">昇順</option>
          </select>
        </div>
      </div>
    )
  }

}
