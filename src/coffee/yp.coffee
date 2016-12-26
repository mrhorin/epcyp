module.exports = class YP

  constructor: (name, url)->
    @name = name
    @url = url
    # index.txt
    @txt = null

  parseIndexTxt: (txt)=>
    channels = []
    if txt?
      for line, index in txt.split(/\n/)
        line = line.split(/<>/)
        # チャンネル名が空値
        continue unless line[0]&&line[1]
        ch =
          "key": line[0]+line[1]
          "name": line[0]
          "id": line[1]
          "tip": line[2]
          "url": line[3]
          "genre": line[4]
          "detail": line[5]
          "listener": line[6]
          "relay": line[7]
          "bps": line[8]
          "format": line[9]
          "time": line[15]
          "comment": line[16]
        channels.push ch
    return channels
