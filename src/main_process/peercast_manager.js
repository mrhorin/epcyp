import { spawn, execSync } from 'child_process'
import Config from 'electron-store'
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
    if (this.peercastPath && !this.isRunning) {
      this.peercast = this.config.get('useMono') ? (
        spawn('mono', [this.peercastPath])
      ) : (
        spawn(this.peercastPath, [])
      )
      this.peercast.on('close', (err) => {
        console.log(err)
        this.stop()
      })
    }
  }

  stop() {
    if (this.isRunning) {
      this.peercast.kill()
      this.peercast = null
    }
  }

  // PeerCastが起動済みか
  get isRunning(){
    if (this.peercast == null) {
      return false
    } else {
      return true
    }
  }

}
