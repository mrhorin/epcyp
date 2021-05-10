import {ipcRenderer} from 'electron'
import moment from 'moment'

/*------------------------------------
  録画機能を操作するクラス
-------------------------------------*/
export default class Recorder{

  // 開始
  // 録画パスを指定できるように
  // 切断（停止ではなく）された時に規定回数 or 延々トライするように
  static start(channel) {
    let now = moment().format("YYYYMMDDHHmmss")
    let path = `/Users/mrhorin/Downloads/${now}${channel.name}.${String(channel.format).toLowerCase()}`
    ipcRenderer.send('start-record', channel, path)
  }

  // 停止
  static stop(pid) {
    ipcRenderer.send('stop-record', pid)
  }

}
