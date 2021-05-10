import React from 'react'
import FormText from 'jsx/form/form_text'
import FormDialog from 'jsx/form/form_dialog'

export default class SettingsRecorder extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div id="settings-recorder">
        {/*FFmpeg本体*/}
        <div className="form-group">
          <label>FFmpegコマンドのフルパス</label>
          <input type="text" value={this.props.ffmpeg} onChange={e => this.props.onChangeForm(e, 'ffmpeg')} />
        </div>
        {/*録画フォルダ*/}
        <FormDialog
          label={"録画フォルダ"} value={this.props.recPath}
          onChange={e => this.props.onChangeForm(e, 'recPath')} onClick={e => this.props.onClickDialog('recPath')}
        />
      </div>
    )
  }

}
