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
          "name": @unEscapeHTML(line[0])
          "id": line[1]
          "tip": line[2]
          "url": line[3]
          "genre": @unEscapeHTML(line[4])
          "detail": @unEscapeHTML(line[5])
          "listener": line[6]
          "relay": line[7]
          "bps": line[8]
          "format": line[9]
          "time": line[15]
          "comment": @unEscapeHTML(line[16])
        ch["genre"] = "［#{line[4]}］" if line[4]
        channels.push ch
    return channels

  unEscapeHTML: (string)=>
    return string.replace(/(&lt;)/g, '<').replace(/(&gt;)/g, '>').replace(/(&quot;)/g, '"').replace(/(&#39;)/g, "'").replace(/(&amp;)/g, '&');
