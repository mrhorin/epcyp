import React from 'react'
import {remote} from 'electron'

import FormText from 'jsx/form/form_text'
import FormDialog from 'jsx/form/form_dialog'

export default class SettingsPlayerDetail extends React.Component {

  constructor(props){
    super(props)
    this.showContextMenu = this.showContextMenu.bind(this)
  }

  set arg(value){
    if(this.textArgs.value){
      this.textArgs.value += ` ${value}`
    }else{
      this.textArgs.value = value
    }
    this.props.onChangeFormat(this.textArgs.value, 'args')
  }

  showContextMenu(e){
    const MenuItem =  remote.MenuItem
    const Menu =  remote.Menu
    let menu = new Menu()
    menu.append(new MenuItem({
      label: 'YP項目',
      type: 'submenu',
      submenu: [
        { label: '$0: チャンネル名', click: ()=>{ this.arg = '"$0"' } },
        { label: '$1: ID', click: ()=>{ this.arg = '"$1"' } },
        { label: '$2: TIP', click: ()=>{ this.arg = '"$2"' } },
        { label: '$3: コンタクトURL', click: ()=>{ this.arg = '"$3"' } },
        { label: '$4: ジャンル', click: ()=>{ this.arg = '"$4"' } },
        { label: '$5: 詳細', click: ()=>{ this.arg = '"$5"' } },
        { label: '$6: リスナー', click: ()=>{ this.arg = '"$6"' } },
        { label: '$7: リレー', click: ()=>{ this.arg = '"$7"' } },
        { label: '$8: ビットレート', click: ()=>{ this.arg = '"$8"' } },
        { label: '$9: タイプ', click: ()=>{ this.arg = '"$9"' } },
      ]
    }))
    menu.append(new MenuItem({
      label: 'URL',
      type: 'submenu',
      submenu: [
        { label: '$x: プレイリストURL', click: ()=>{ this.arg = '"$x"' } },
        { label: '$y: ストリームURL', click: ()=>{ this.arg = '"$y"' } },
      ]
    }))
    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
  }

  render(){
    return(
      <div id="settings-player-detail">
        {/*タイプ*/}
        <FormText label={"タイプ(正規表現)"} value={this.props.format.name}
          onChange={e => this.props.onChangeFormat(e.target.value, 'name')} />
        {/*再生プレイヤー*/}
        <FormDialog label={"再生プレイヤー"} value={this.props.format.player}
          onChange={e => this.props.onChangeFormat(e, 'player')}
          onClick={e => this.props.onClickDialog(e, this.props.index)} />
        {/*引数*/}
        <div id="settings-player-args" className="form-group">
          <label>引数</label>
          <input type="text" ref={(input) => { this.textArgs = input }} value={this.props.format.args}
            onChange={e => this.props.onChangeFormat(e.target.value, 'args')} />
          <button className="btn btn-default" onClick={this.showContextMenu}>
            <span className="icon icon-dot-3"></span>
          </button>
        </div>
      </div>
    )
  }

}
