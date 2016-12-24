request = require 'superagent'

module.exports = class YP

  constructor: (name, url)->
    @name = name
    @url = url
    @channels = []

  parseIndexTxt: (txt)=>
    if txt?
      for line, index in txt.split(/\n/)
        line = line.split(/<>/)
        ch =
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
        @channels.push ch
    return @channels
