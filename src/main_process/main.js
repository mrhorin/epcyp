import {ipcMain, app, BrowserWindow, Tray, Menu} from 'electron'
import {exec, spawn} from 'child_process'
import request from 'superagent'
import Config from 'electron-config'
import fixPath from 'fix-path'

import TrayManager from 'main_process/tray_manager'
import MenuManager from 'main_process/menu_manager'

const config = new Config({
  defaults: {
    bounds: { width: 300, height: 600 },
    peercast: "",
    exitPeercast: true,
    useMono: false,
    playerPath: '',
    playerArgs: '"$x"',
    bbs: ""
  }
})

var mainWindow = null
var settingsWindow = null
var favoriteWindow = null

var tray = new TrayManager(`${__dirname}/../src/img/icon/darwin/icon_18x18.png`)
var menu = new MenuManager()

/*-----------------------------------------
  アプリケーション起動準備完了時
-----------------------------------------*/
app.on('ready', ()=>{
  // PATHの解決
  fixPath()

  // アプリケーションメニュー
  menu.setContextMenu([
    {
      label: '編集',
      submenu: [
        {
          label: 'コピー',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'カット',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'ペースト',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: '全選択',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        },
        { type: 'separator' },
        {
          label: '戻る',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: '進む',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        }
      ]
    }
  ])
  menu.setMacContextMenu({
      label: app.getName(),
      submenu: [
        { label: '環境設定', accelerator: 'Command+,', click: ()=>{ app.quit() } },
        { label: '終了', accelerator: 'Command+Q', click: ()=>{ app.quit() } }
      ]
  })
  menu.show()

  // システムトレイ
  tray.setContextMenu([{ label: '終了', click: ()=>{ app.quit() } }])
  tray.show()

  const platform = global.process.platform
  // PeerCast起動コマンド
  var peercastCmd = config.get('useMono') ? `mono ${config.get('peercast')}` : config.get('peercast')
  // プロセス起動確認コマンド
  let psCmd
  if(platform == 'win32'){
    psCmd = `tasklist | find "${peercastCmd}"`
  }else{
    psCmd = `ps x | grep "${peercastCmd}"`
  }
  // 既に同名のプロセスが存在しないか
  let pattern = new RegExp(peercastCmd, 'gi')
  var peercast
  exec(psCmd, (error, stdout, stderr)=>{
    stdout = stdout.split(/\n/).map((line, index, stdout)=>{
      // grepを含む行を除外
      if(line.match(/grep/)) return
      // PeerCast起動コマンドを含む行は返す
      if(line.match(peercastCmd)) return line
      return
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
    icon: `${__dirname}/../src/img/icon/icon_1024x1024.png`
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)

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

// -------------- お気に入り --------------
ipcMain.on('asyn-favorite-window', (event) =>{
  openFavoriteWindow()
})
// 閉じる
ipcMain.on('asyn-favorite-window-close', (event) =>{
  closeFavoriteWindow()
})

const openFavoriteWindow = ()=>{
  let bounds = getChildBoundsFromMain(480, 370)
  favoriteWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    center: false,
    frame: false,
    alwaysOnTop: true,
    resizable: false
  })
  favoriteWindow.loadURL(`file://${__dirname}/favorite.html`)
  mainWindow.setIgnoreMouseEvents(true)
}

const closeFavoriteWindow = ()=>{
  favoriteWindow.close()
  favoriteWindow = null
  mainWindow.setIgnoreMouseEvents(false)
  mainWindow.send('asyn-favorite-window-close-reply')
}

// ------------------ 設定 ------------------
ipcMain.on('asyn-settings-window', (event) =>{
  let bounds = getChildBoundsFromMain(400, 350)
  settingsWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    center: false,
    frame: false,
    alwaysOnTop: true,
    resizable: false
  })
  settingsWindow.loadURL(`file://${__dirname}/settings.html`)
  mainWindow.setIgnoreMouseEvents(true)
})
// 閉じる
ipcMain.on('asyn-settings-window-close', (event) =>{
  settingsWindow.close()
  mainWindow.setIgnoreMouseEvents(false)
  mainWindow.send('asyn-settings-window-close-reply')
})

// mainWindowの中心の相対座標を取得
const getChildBoundsFromMain = (childWidth, childHeight)=>{
  let parrent = mainWindow.getBounds()
  let x = Math.round(
    parrent.x + (parrent.width/2) - (childWidth/2)
  )
  let y = Math.round(
    parrent.y + (parrent.height/2) - (childHeight/2)
  )
  return { x: x, y: y, width: childWidth, height: childHeight }
}
