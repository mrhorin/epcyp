import React from 'react'
import FormText from 'jsx/form/form_text'
import FormDialog from 'jsx/form/form_dialog'

module.exports = class SettingsPeerCast extends React.Component {

  constructor(props){
    super(props)
    this.onChangeCheckbox = this.onChangeCheckbox.bind(this)
  }

  onChangeCheckbox(){
    this.props.onChangeCheckbox(this.refs.exitPeercast)
  }

  render(){
    return(
      <div id="settings-peercast">
        <FormDialog label={"PeerCast起動コマンド"} value={this.props.peercast}
          onChange={e => this.props.onChangeForm(e, 'peercast')} onClick={e => this.props.onClickDialog('peercast')} />
        <input className="checkbox" type="checkbox" name="exitPeercast" ref="exitPeercast" value={this.props.exitPeercast}
          checked={this.props.exitPeercast} onChange={this.onChangeCheckbox} />終了時にPeerCastを終了する
        <div>mono使用時はmonoコマンドを併記してください</div>
      </div>
    )
  }

}
