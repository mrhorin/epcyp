import request from 'superagent'
import Config from 'electron-config'

const config = new Config({ defaults: { port: 7144 } })

/*-----------------------------------------------------------------
  PeerCastStionを操作するクラス
  参考: PeerCastStation.UI.HTTP/html/js/peercaststation.1.0.0.js
------------------------------------------------------------------*/
module.exports = class Peercaststion{

  // チャンネル情報一覧を取得
  static getChannels(call=()=>{}){
    this.postRequest('getChannels', null, (err, res)=>{
      call(err, res)
    })
  }

  // 切断
  static stopChannel(channelId, call=()=>{}){
    this.postRequest('stopChannel', { channelId: channelId }, (err, res)=>{
      call(err, res)
    })
  }

  // 再接続
  static bumpChannel(channelId, call=()=>{}){
    this.postRequest('bumpChannel', { channelId: channelId }, (err, res)=>{
      call(err, res)
    })
  }

  static get API_URL(){
    return 'http://127.0.0.1:'+config.get('port')+'/api/1'
  }

  // 4桁のランダムな数値IDを取得
  static get getRandomId(){
    return Math.floor(Math.random()*10000)
  }

  // APIへリクエスト
  static postRequest(method, params=null, call=()=>{}){
    let json = {
      jsonrpc: '2.0',
      id: this.getRandomId,
      method: method
    }
    if(params) json.params = params
    request.post(this.API_URL).send(JSON.stringify(json))
      .set('X-Requested-With', 'X-Requested-With')
      .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
      .end((err, res)=>{
        call(err, res)
      })
  }

}
