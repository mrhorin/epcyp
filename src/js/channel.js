module.exports = class Channel{

  constructor(hash){
    this.key = hash.key
    this.name = this.unEscapeHTML(hash.name)
    this.id = hash.id
    this.tip = hash.tip
    this.url = hash.url
    this.genre = this.unEscapeHTML(hash.genre)
    this.detail = this.unEscapeHTML(hash.detail).replace(/(<Free>)|(<Open>)/, '').replace(/(- )$/, '')
    this.listener = Number(hash.listener)
    this.relay = Number(hash.relay)
    this.kbps = Number(hash.kbps)
    this.format = hash.format
    this.time = hash.time
    this.comment = this.unEscapeHTML(hash.comment)
    if(this.genre) this.genre = `[${this.genre}] `
  }

  unEscapeHTML(string){
    return string.replace(/(&lt;)/g, '<').replace(/(&gt;)/g, '>').replace(/(&quot;)/g, '"').replace(/(&#39;)/g, "'").replace(/(&amp;)/g, '&')
  }

}