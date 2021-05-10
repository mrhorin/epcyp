import {ipcRenderer} from 'electron'
import moment from 'moment'
import Config from 'electron-store'

const config = new Config()

/*------------------------------------
  録画機能を操作するクラス
-------------------------------------*/
export default class Recorder{

  // 開始
  // 切断（停止ではなく）された時に規定回数 or 延々トライするように
  static start(channel) {
    let now = moment().format("YYYYMMDDHHmmss")
    let path = `${config.get('recPath')}/${now}${channel.name}.${String(channel.format).toLowerCase()}`
    ipcRenderer.send('start-record', channel, path)
  }

  // 停止
  static stop(pid) {
    ipcRenderer.send('stop-record', pid)
  }

}
