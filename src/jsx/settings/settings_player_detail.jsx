import React from 'react'

import FormText from 'jsx/form/form_text'
import FormDialog from 'jsx/form/form_dialog'

module.exports = class SettingsPlayerDetail extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div id="settings-player-detail">
        <FormText label={"拡張子(正規表現)"} value={this.props.format.name}
          onChange={e => this.props.onChangeFormat(e, 'name')} />
        <FormDialog label={"再生プレイヤー"} value={this.props.format.player}
          onChange={e => this.props.onChangeFormat(e, 'player')}
          onClick={e => this.props.onClickDialog(e, this.props.index)} />
        <FormText label={"引数"} value={this.props.format.args}
          onChange={e => this.props.onChangeFormat(e, 'args')} />
      </div>
    )
  }

}
