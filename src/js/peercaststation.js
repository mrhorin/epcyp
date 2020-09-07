import request from 'axios'
import Config from 'electron-config'

const config = new Config({ defaults: { port: 7144 } })

/*-----------------------------------------------------------------
  PeerCastStionを操作するクラス
  参考: PeerCastStation.UI.HTTP/html/js/peercaststation.1.0.0.js
------------------------------------------------------------------*/
export default class Peercaststation{

  // 切断
  static stopChannel(channelId, call=()=>{}){
    this.postRequest('stopChannel', { channelId: channelId }, (res)=>{
      call(res)
    })
  }

  // 再接続
  static bumpChannel(channelId, call=()=>{}){
    this.postRequest('bumpChannel', { channelId: channelId }, (res)=>{
      call(res)
    })
  }

  // 接続一覧を取得
  static getChannelConnections(channelId, call=()=>{}){
    this.postRequest('getChannelConnections', { channelId: channelId }, (res)=>{
      call(res)
    })
  }

  // 特定のチャンネルへの特定の接続を停止
  static stopChannelConnection(channelId, connectionId, call=()=>{}){
    this.postRequest(
      'stopChannelConnection',
      { channelId: channelId, connectionId: connectionId },
      (res)=>{ call(res) }
    )
  }

  // リレツリーを取得
  static getChannelRelayTree(channelId, call=()=>{}){
    this.postRequest('getChannelRelayTree', { channelId: channelId }, (res)=>{
      call(res)
    })
  }

  // PeerCast本体に関するステータスを取得
  static getStatus(call=()=>{}){
    this.postRequest('getStatus', null, (res)=>{
      call(res)
    })
  }

  // チャンネル情報一覧を取得
  static getChannels(call=()=>{}){
    this.postRequest('getChannels', null, (res)=>{
      call(res)
    })
  }

  // APIへリクエスト
  static postRequest(method, params=null, call=()=>{}){
    let json = {
      jsonrpc: '2.0',
      id: this.getRandomId,
      method: method
    }
    if (params) json.params = params
    request.post(
      this.API_URL,
      JSON.stringify(json),
      {
        headers:       {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
    ).then((res) => {
      call(res)
    }).catch((err) => {
      console.log(err)
    })
  }

  static get API_URL(){
    let ip = config.get('ip')
    let port = config.get('port')
    return `http://${ip}:${port}/api/1`
  }

  // 4桁のランダムな数値IDを取得
  static get getRandomId(){
    return Math.floor(Math.random()*10000)
  }

}
