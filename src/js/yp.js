module.exports = class YP{

  constructor(name, url){
    this.name = name
    this.url = this.parseUrl(url)
  }

  parseIndexTxt(txt){
    var channels = []
    if(txt){
      for(let line of txt.split(/\n/)){
        line = line.split(/<>/)
        // チャンネル名とIDが空値
        if(!line[0]&&!line[1]) continue;
        var ch = {
          key: line[0]+line[1],
          name: this.unEscapeHTML(line[0]),
          id: line[1],
          tip: line[2],
          url: line[3],
          genre: this.unEscapeHTML(line[4]),
          detail: this.unEscapeHTML(line[5]).replace(/(<Free>)|(<Open>)/, '').replace(/(- )$/, ''),
          listener: Number(line[6]),
          relay: Number(line[7]),
          kbps: Number(line[8]),
          format: line[9],
          time: line[15],
          comment: this.unEscapeHTML(line[17]),
        }
        if(line[4]) ch['genre'] = `［${line[4]}］`;
        channels.push(ch)
      }
    }
    return channels
  }

  // YPのURL末尾を/index.txtの形に変換
  parseUrl(url){
    // urlの末尾1文字
    let urlEnd = url.slice(-1)
    if(urlEnd != '/') url += '/'
    return url+'index.txt'
  }

  unEscapeHTML(string){
    return string.replace(/(&lt;)/g, '<').replace(/(&gt;)/g, '>').replace(/(&quot;)/g, '"').replace(/(&#39;)/g, "'").replace(/(&amp;)/g, '&')
  }

}
