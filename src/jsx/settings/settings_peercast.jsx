import React from 'react'
import FormText from 'jsx/form/form_text'
import FormDialog from 'jsx/form/form_dialog'

export default class SettingsPeerCast extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div id="settings-peercast">
        {/*ポート番号*/}
        <div className="form-group">
          <label>ポート番号</label>
          <input type="number" value={this.props.port} onChange={e => this.props.onChangeForm(e, 'port')} />
        </div>
        {/*PeerCast IPアドレス*/}
        <div className="form-group">
          <label>PeerCast IPアドレス</label>
          <input type="text" value={this.props.ip} onChange={e => this.props.onChangeForm(e, 'ip')} />
        </div>
        {/*PeerCast本体*/}
        <FormDialog
          label={"PeerCast本体"} value={this.props.peercast}
          onChange={e => this.props.onChangeForm(e, 'peercast')} onClick={e => this.props.onClickDialog('peercast')}
        />
        <div className="form-group">
          <input
            className="checkbox" type="checkbox" name="useMono" ref="useMono" value={this.props.useMono}
            checked={this.props.useMono} onChange={e => { this.props.onChangeCheckbox(e.target) }}
          />
          <span onClick={e =>{this.props.onChangeCheckbox(this.refs.useMono)}}>monoを使用して起動する</span>
        </div>
        {/*終了時*/}
        <div className="form-group">
          <input
            className="checkbox" type="checkbox" name="exitPeercast" ref="exitPeercast" value={this.props.exitPeercast}
            checked={this.props.exitPeercast} onChange={e => { this.props.onChangeCheckbox(e.target) }}
          />
          <span onClick={e =>{this.props.onChangeCheckbox(this.refs.exitPeercast)}}>
            終了時にPeerCastを終了する
          </span>
        </div>
      </div>
    )
  }

}
