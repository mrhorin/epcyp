module.exports = class YP{

  constructor(name, url){
    this.name = name
    this.url = url
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
          detail: this.unEscapeHTML(line[5]).replace(/(- <Free>)|(- <Open>)/, ''),
          listener: Number(line[6]),
          relay: Number(line[7]),
          kbps: Number(line[8]),
          format: line[9],
          time: line[15],
          comment: this.unEscapeHTML(line[16]),
        }
        if(line[4]) ch['genre'] = `［${line[4]}］`;
        channels.push(ch)
      }
    }
    return channels
  }

  unEscapeHTML(string){
    return string.replace(/(&lt;)/g, '<').replace(/(&gt;)/g, '>').replace(/(&quot;)/g, '"').replace(/(&#39;)/g, "'").replace(/(&amp;)/g, '&')
  }

}
