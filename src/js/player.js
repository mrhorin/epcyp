import {ipcRenderer} from 'electron'
import Config from 'electron-store'
import storage from 'electron-json-storage'
const config = new Config({
  defaults: { port: 7144, playerPath: '', playerArgs: '"$x"' }
})

/*------------------------------------
  再生プレイヤーを操作するクラス
-------------------------------------*/
export default class Player{

  constructor(channel){
    this.channel = channel
  }

  // プレイヤーで再生する
  play(){
    storage.get('formatList', (error, data)=>{
      for(let i=0; i<data.length; i++){
        let format = data[i]
        let ptn = new RegExp(format.name, "i")
        if(this.channel.format.match(ptn)){
          ipcRenderer.send('asyn-play', format.player, this.getPlayArgs(format.args))
          break
        }
      }
    })
  }

  // プレイリストURLを取得
  get playListURL(){
    let ip = config.get('ip')
    let port = config.get('port')
    var url = `http://${ip}:${port}/pls/${this.channel.id}?tip=${this.channel.tip}`
    return url
  }

  // ストリームURLを取得
  get streamURL(){
    let ip = config.get('ip')
    let port = config.get('port')
    var url = `http://${ip}:${port}/stream/${this.channel.id}.${this.channel.format.toLowerCase()}`
    return url
  }

  // 再生用引数を取得
  getPlayArgs(args){
    let res = args
    let variables = {
      "$x": this.playListURL,
      "$y": this.streamURL,
      "$0": this.channel.name,
      "$1": this.channel.id,
      "$2": this.channel.tip,
      "$3": this.channel.url,
      "$4": this.channel.genre,
      "$5": this.channel.detail,
      "$6": this.channel.listener,
      "$7": this.channel.relay,
      "$8": this.channel.kbps,
      "$9": this.channel.format
    }
    // 変数を置換
    for (let key in variables) {
      res = res.replace(key, variables[key])
    }
    return res
  }

}
