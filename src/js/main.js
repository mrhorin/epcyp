import electron from 'electron'
import request from 'superagent'
import path from 'path'
import Config from 'electron-config'
import loadDevTool from 'electron-load-devtool'
import {exec} from 'child_process'
import {spawn} from 'child_process'
const ipcMain = electron.ipcMain
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const config = new Config({
  defaults: { bounds: { width: 800, height: 600 } }
})

var mainWindow = null
var settingsWindow = null
var favoriteWindow = null

// 起動準備ができた時
app.on('ready', ()=>{
  // PeerCast起動コマンド
  var peercastCmd = config.get('useMono') ? `mono ${config.get('peercast')}` : config.get('peercast')
  // プロセス起動確認コマンド
  let psCmd
  let platform = global.process.platform
  if(platform.match(/^win/gi)){
    psCmd = `tasklist | find "${peercastCmd}"`
  }else{
    psCmd = `ps | grep "${peercastCmd}"`
  }
  // 既に同名のプロセスが存在しないか
  let pattern = new RegExp(peercastCmd, 'gi')
  let peercast
  exec(psCmd, (error, stdout, stderr)=>{
    // grepを含む行を除外
    stdout = stdout.split(/\n/).map((line, index, stdout)=>{
      if(line.match(/grep/)) return
      return line
    }).join()
    // PeerCast起動チェック
    if(!stdout.match(pattern)&&config.get("peercast")){
      peercast = exec(peercastCmd)
    }
  })

  // メインウィンドウ
  const {width, height, x, y} = config.get('bounds')
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minWidth: 150,
    x: x,
    y: y,
    frame: true,
    titleBarStyle: 'hidden-inset',
    scrollBounce: true,
    autoHideMenuBar: true
  })
  mainWindow.loadURL(`file://${path.resolve(path.join('dist', 'index.html'))}`)

  mainWindow.on('blur', (event, arg)=>{
    event.sender.send('index-window-blur')
  })
  mainWindow.on('focus', (event, arg)=>{
    event.sender.send('index-window-focus')
  })

  // メインウィンドウが閉じられた時
  mainWindow.on('close', ()=>{
    config.set('bounds', mainWindow.getBounds())
    // PeerCastを終了
    try{
      if(config.get('exitPeercast')&&peercast) peercast.kill()
    }catch(e){
      console.log(e)
    }
    app.quit()
  })
})

// すべてのウィンドウが閉じた時
app.on('window-all-closed', ()=>{
  if(process.platform != 'darwin') app.quit()
})

// index.txtの取得
ipcMain.on('asyn-yp', (event, yp)=>{
  request.get(yp.url).end((err,res)=>{
    try{
      if(res.status == 200 && !res.error){
        yp["txt"] = res.text
      }else{
        yp["txt"] = null
        console.log(res.error)
      }
      event.sender.send('asyn-yp-reply', yp)
    }catch(e){
      console.log(e)
    }
  })
})

// プレイヤーの起動
ipcMain.on('asyn-play', (event, args) =>{
  let command
  if(global.process.platform=='darwin'){
    // Macの場合はopenコマンドで実行
    command = spawn('open', ['-a', config.get('playerPath'), args])
  }else{
    command = spawn(config.get('playerPath'), [args])
  }
  try{
    exec(command, (error, stdout, stderr)=>{
      console.log(stdout)
    })
  }catch(e){
    console.log(e)
  }
})

// BBSブラウザの起動
ipcMain.on('asyn-open-bbs', (event, url, platform) =>{
  let command
  if(platform=='darwin'){
    command = spawn('open', ['-a', config.get('bbs'), url])
  }else{
    command = spawn(config.get('bbs'))
  }
  try{
    exec(command, (error, stdout, stderr)=>{
      console.log(stdout)
    })
  }catch(e){
    console.log(e)
  }
})

// お気に入りウィンドウを開く
ipcMain.on('asyn-favorite-window', (event) =>{
  favoriteWindow = new BrowserWindow({
    width: 480,
    height: 370,
    frame: false,
    alwaysOnTop: true,
    resizable: false
  })
  favoriteWindow.loadURL(`file://${path.resolve(path.join('dist', 'favorite.html'))}`)
  mainWindow.setIgnoreMouseEvents(true)
})
// お気に入りウィンドウを閉じる
ipcMain.on('asyn-favorite-window-close', (event) =>{
  favoriteWindow.close()
  mainWindow.setIgnoreMouseEvents(false)
  mainWindow.send('asyn-favorite-window-close-reply')
})

// 設定ウィンドウを開く
ipcMain.on('asyn-settings-window', (event) =>{
  settingsWindow = new BrowserWindow({
    width: 400,
    height: 350,
    frame: false,
    alwaysOnTop: true,
    resizable: false
  })
  settingsWindow.loadURL(`file://${path.resolve(path.join('dist', 'settings.html'))}`)
  mainWindow.setIgnoreMouseEvents(true)
})
// 設定ウィンドウを閉じる
ipcMain.on('asyn-settings-window-close', (event) =>{
  settingsWindow.close()
  mainWindow.setIgnoreMouseEvents(false)
  mainWindow.send('asyn-settings-window-close-reply')
})
