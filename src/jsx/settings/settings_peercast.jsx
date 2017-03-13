import React from 'react'
import FormText from 'jsx/form/form_text'
import FormDialog from 'jsx/form/form_dialog'

module.exports = class SettingsPeerCast extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div id="settings-peercast">
        <FormDialog label={"PeerCast起動コマンド"} value={this.props.peercast}
          onChange={e => this.props.onChangeForm(e, 'peercast')} onClick={e => this.props.onClickDialog('peercast')} />
        <div className="form-group">
          <input className="checkbox" type="checkbox" name="useMono" ref="useMono" value={this.props.useMono}
            checked={this.props.useMono} onChange={e =>{this.props.onChangeCheckbox(e.target)}} />
            <span onClick={e =>{this.props.onChangeCheckbox(this.refs.useMono)}}>monoを使用して起動する</span>
        </div>
        <div className="form-group">
          <input className="checkbox" type="checkbox" name="exitPeercast" ref="exitPeercast" value={this.props.exitPeercast}
            checked={this.props.exitPeercast} onChange={e =>{this.props.onChangeCheckbox(e.target)}} />
            <span onClick={e =>{this.props.onChangeCheckbox(this.refs.exitPeercast)}}>
              終了時にPeerCastを終了する
            </span>
        </div>
        <div className="form-group">
          <input className="checkbox" type="checkbox" name="showGuiTab" ref="showGuiTab" value={this.props.showGuiTab}
            checked={this.props.showGuiTab} onChange={e =>{this.props.onChangeCheckbox(e.target)}} />
            <span onClick={e =>{this.props.onChangeCheckbox(this.refs.showGuiTab)}}>
              リレー管理タブを表示する（PeerCastStation使用時のみ）
            </span>
        </div>
      </div>
    )
  }

}
