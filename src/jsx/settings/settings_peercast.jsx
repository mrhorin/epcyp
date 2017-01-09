import React from 'react'
import FormText from 'jsx/form/form_text'
import FormDialog from 'jsx/form/form_dialog'

module.exports = class SettingsPeerCast extends React.Component {

  constructor(props){
    super(props)
    this.onChangeCheckbox = this.onChangeCheckbox.bind(this)
  }

  onChangeCheckbox(event){
    this.props.onChangeCheckbox(event)
  }

  render(){
    return(
      <div id="settings-peercast">
        <FormDialog label={"PeerCast起動コマンド"} value={this.props.peercast}
          onChange={e => this.props.onChangeForm(e, 'peercast')} onClick={e => this.props.onClickDialog('peercast')} />
        <div className="form-group">
          <input className="checkbox" type="checkbox" name="useMono" ref="useMono" value={this.props.useMono}
            checked={this.props.useMono} onChange={this.onChangeCheckbox} />monoを使用して起動する
        </div>
        <div className="form-group">
          <input className="checkbox" type="checkbox" name="exitPeercast" ref="exitPeercast" value={this.props.exitPeercast}
            checked={this.props.exitPeercast} onChange={this.onChangeCheckbox} />終了時にPeerCastを終了する
        </div>
      </div>
    )
  }

}
