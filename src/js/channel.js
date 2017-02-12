import _ from 'lodash'

module.exports = class Channel{

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
    this.time = hash.time
    this.comment = this.unEscapeHTML(hash.comment)
    if(this.genre) this.genre = `[${this.genre}] `
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

}
