import React from 'react'
import FormText from 'jsx/form/form_text'
import FormDialog from 'jsx/form/form_dialog'

module.exports = class SettingsPlayer extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div id="settings-player">
        <FormDialog label={"再生プレイヤー"} value={this.props.playerPath}
          onChange={e => this.props.onChangeForm(e, 'playerPath')} onClick={e => this.props.onClickDialog('playerPath')} />
        <FormText label={"引数"} value={this.props.playerArgs}
          onChange={e => this.props.onChangeForm(e, 'playerArgs')} onClick={e => this.props.onClickDialog('playerArgs')} />
      </div>
    )
  }

}
