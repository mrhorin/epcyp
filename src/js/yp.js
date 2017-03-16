import Channel from 'js/channel'

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
        var hash = {
          key: line[1]+Math.floor(Math.random()*0xFFFFFF).toString(16).toUpperCase(),
          name: line[0],
          id: line[1],
          tip: line[2],
          url: line[3],
          genre: line[4],
          detail: line[5],
          listener: line[6],
          relay: line[7],
          kbps: line[8],
          format: line[9],
          track: {
            artist: line[10],
            album: line[11],
            title: line[12],
            url: line[13]
          },
          time: line[15],
          comment: line[17],
          yp: {
            name: this.name,
            url: this.url
          }
        }
        var channel = new Channel(hash)
        channels.push(channel)
      }
    }
    return channels
  }

  // YPのURL末尾に/をつける
  parseUrl(url){
    // urlの末尾1文字
    let urlEnd = url.slice(-1)
    if(urlEnd != '/') url += '/'
    return url
  }

}
