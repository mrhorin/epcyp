import { dialog } from 'electron'
import { spawn, execSync } from 'child_process'
import Config from 'electron-config'
import fixPath from 'fix-path'

/*---------------------------------------
  PeerCast本体を操作するクラス
----------------------------------------*/
export default class PeercastManager{

  constructor(){
    // PATHの解決
    fixPath()
    this.config = new Config({
      defaults: {
        peercast: "",
        exitPeercast: true,
        useMono: false,
      }
    })
    this.peercast = null
    this.peercastPath = this.config.get('peercast')
  }

  async start() {
    if (this.peercastPath && !this.checkStarted()) {
      this.peercast = this.config.get('useMono') ? (
        spawn('mono', [this.peercastPath])
      ) : (
        spawn(this.peercastPath, [])
      )
      this.peercast.on('error', (err) => {
        dialog.showErrorBox('PeerCast本体の起動失敗', `${err}`)
      })
    }
  }

  stop(){
    if (this.config.get('exitPeercast') && this.peercast) {
      this.peercast.kill()
    }
  }

  // PeerCastが起動済みか
  checkStarted(){
    // 起動確認コマンド
    let psCmd
    if(global.process.platform == 'win32'){
      psCmd = `tasklist | find "${this.peercastPath}"`
    }else{
      psCmd = `ps x | grep "${this.peercastPath}"`
    }

    // psコマンド実行結果からPeerCast起動コマンドを含む行を抽出
    let stdout = execSync(psCmd).toString()
    stdout = stdout.split(/\n/).map((line, index)=>{
      // grepを含む行を除外
      if(line.match(/grep/)) return
      // PeerCast起動コマンドを含む行は返す
      if(line.match(this.peercastPath)) return line
      return
    }).join()

    let pattern = new RegExp(this.peercastPath, 'gi')
    if(!stdout.match(pattern)&&this.config.get("peercast")){
      return false
    }else{
      return true
    }
  }

}
