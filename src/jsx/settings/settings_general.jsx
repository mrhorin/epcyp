import React from 'react'

module.exports = class SettingsGeneral extends React.Component {

  constructor(props){
    super(props)
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
      </div>
    )
  }

}
