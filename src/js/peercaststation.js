import request from 'superagent'
import Config from 'electron-config'

const config = new Config({ defaults: { port: 7144 } })

/*-----------------------------------------------------------------
  PeerCastStionを操作するクラス
  参考: PeerCastStation.UI.HTTP/html/js/peercaststation.1.0.0.js
------------------------------------------------------------------*/
module.exports = class Peercaststation{

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

  // 接続一覧を取得
  static getChannelConnections(channelId, call=()=>{}){
    this.postRequest('getChannelConnections', { channelId: channelId }, (err, res)=>{
      call(err, res)
    })
  }

  // 特定のチャンネルへの特定の接続を停止
  static stopChannelConnection(channelId, connectionId, call=()=>{}){
    this.postRequest(
      'stopChannelConnection',
      { channelId: channelId, connectionId: connectionId },
      (err, res)=>{ call(err, res) }
    )
  }

  // リレツリーを取得
  static getChannelRelayTree(channelId, call=()=>{}){
    this.postRequest('getChannelRelayTree', { channelId: channelId }, (err, res)=>{
      call(err, res)
    })
  }

  // PeerCast本体に関するステータスを取得
  static getStatus(call=()=>{}){
    this.postRequest('getStatus', null, (err, res)=>{
      call(err, res)
    })
  }

  // チャンネル情報一覧を取得
  static getChannels(call=()=>{}){
    this.postRequest('getChannels', null, (err, res)=>{
      call(err, res)
    })
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
      .timeout(3000)
      .end((err, res)=>{
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

}
