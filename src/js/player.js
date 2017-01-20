import {ipcRenderer} from 'electron'
import Config from 'electron-config'

const config = new Config({
  defaults: { port: 7144, playerPath: '', playerArgs: '"$x"' }
})

/*------------------------------------
  再生プレイヤーを操作するクラス
-------------------------------------*/
module.exports = class Plsyer{

  constructor(channel){
    this.channel = channel
  }

  // プレイヤーで再生する
  play(){
    ipcRenderer.send('asyn-play', this.args)
  }

  // プレイリストURLを取得
  get playListURL(){
    let port = config.get('port')
    var url = `http://127.0.0.1:${port}/pls/${this.channel.id}?tip=${this.channel.tip}`
    return url
  }

  // ストリームURLを取得
  get streamURL(){
    let port = config.get('port')
    var url = `http://127.0.0.1:${port}/stream/${this.channel.id}.${this.channel.format.toLowerCase()}`
    return url
  }

  // 引数で設定した値を取得
  get args(){
    let res = ""
    let item = {
      "$x": this.playListURL,
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
    for(let arg of config.get('playerArgs').split(/\s/)){
      res += `${item[arg.replace(/(")/gm, "")]} `
    }
    return res.replace(/\s$/, "")
  }

}
