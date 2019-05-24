import Config from 'electron-config'
import _ from 'lodash'
const config = new Config({
  defaults: { port: 7144, playerPath: '', playerArgs: '"$x"' }
})

export default class Channel{

  constructor(hash){
    this.key = hash.key
    this.name = this.unEscapeHTML(hash.name)
    this.id = hash.id
    this.tip = hash.tip
    this.url = hash.url
    this.genre = this.unEscapeHTML(hash.genre)
    this.detail = this.unEscapeHTML(hash.detail).replace(/(<Free>)|(<Open>)/, '').replace(/(- )$/, '')
    this.listener = this.toNumber(hash.listener)
    this.relay = this.toNumber(hash.relay)
    this.kbps = this.toNumber(hash.kbps)
    this.format = hash.format
    this.track = hash.track
    this.time = hash.time
    this.comment = this.unEscapeHTML(hash.comment)
    this.yp = hash.yp
  }

  unEscapeHTML(string){
    if(!string)  return ""
    return string.replace(/(&lt;)/g, '<').replace(/(&gt;)/g, '>').replace(/(&quot;)/g, '"').replace(/(&#39;)/g, "'").replace(/(&amp;)/g, '&')
  }

  toNumber(string){
    let num = Number(string)
    if(num){
      return num
    }else{
      return 0
    }
  }

  // 文字列をutf-16コードの数値列にして返す
  getCharCode(string){
    let res = ""
    for(let s of string){
      res += s.charCodeAt().toString()
    }
    return _.toInteger(res)
  }

  get desc(){
    let genre = this.genre&&this.detail ? `${this.genre} - ` : this.genre
    return `${genre}${this.detail} ${this.comment} ${this.track.artist}`
  }

  // プレイリストURLを取得
  get playListURL(){
    let ip = config.get('ip')
    let port = config.get('port')
    var url = `http://${ip}:${port}/pls/${this.id}?tip=${this.tip}`
    return url
  }

  // ストリームURLを取得
  get streamURL(){
    let ip = config.get('ip')
    let port = config.get('port')
    var url = `http://${ip}:${port}/stream/${this.id}.${this.format.toLowerCase()}`
    return url
  }

  // 統計URLを取得
  get statisticsURL(){
    return `${this.yp.url}getgmt.php?cn=${this.name}`
  }

}
