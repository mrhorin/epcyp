import {ipcRenderer} from 'electron'
import moment from 'moment'

/*------------------------------------
  録画機能を操作するクラス
-------------------------------------*/
export default class Recorder{

  // 開始
  static start(channel) {
    let now = moment().format("YYYYMMDDHHmmss")
    ipcRenderer.send('rec-start', channel.playListURL, channel.streamURL, `/Users/mrhorin/Downloads/${now}${channel.name}.${String(channel.format).toLowerCase()}`)
  }

}
