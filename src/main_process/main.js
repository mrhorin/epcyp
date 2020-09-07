import {systemPreferences, ipcMain, app, BrowserWindow, Tray, Menu, shell} from 'electron'
import {exec, execSync} from 'child_process'
import request from 'axios'
import Config from 'electron-config'

import TrayManager from 'main_process/tray_manager'
import MenuManager from 'main_process/menu_manager'
import PeercastManager from 'main_process/peercast_manager'

const config = new Config({
  defaults: {
    bounds: { width: 300, height: 600 },
    playerPath: '',
    playerArgs: '"$x"',
    bbs: "",
    theme: 'light'
  }
})

var window = { main: null, settings: null, favorite: null }

var tray = new TrayManager()
var menu = new MenuManager()
var peercast = new PeercastManager()

systemPreferences.setAppLevelAppearance(config.get('theme'))

/*-----------------------------------------
  アプリケーション起動準備完了時
-----------------------------------------*/
app.on('ready', ()=>{
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
        },
        { type: 'separator' },
        {
          label: '検索',
          accelerator: 'CmdOrCtrl+F',
          click: ()=>{
            window.main.webContents.send('shortcut-search')
          }
        },
        { type: 'separator' },
        {
          label: 'タブ左移動',
          accelerator: 'CmdOrCtrl+Left',
          click: ()=>{
            window.main.webContents.send('shortcut-tab-left')
          }
        },
        {
          label: 'タブ右移動',
          accelerator: 'CmdOrCtrl+Right',
          click: ()=>{
            window.main.webContents.send('shortcut-tab-right')
          }
        },
      ]
    },
    {
      label: 'ヘルプ',
      submenu: [
        { label: 'epcypについて', click: ()=>{ shell.openExternal("https://github.com/mrhorin/epcyp") } },
        { label: "問題を報告する", click: ()=>{ shell.openExternal("https://github.com/mrhorin/epcyp/issues") } }
      ]
    }
  ])
  menu.setMacContextMenu({
      label: app.getName(),
      submenu: [
        { label: 'epcypについて', click: ()=>{ shell.openExternal("https://github.com/mrhorin/epcyp") } },
        { type: 'separator' },
        { label: '環境設定', accelerator: 'Command+,', click: ()=>{ openSettingsWindow() } },
        { label: 'お気に入り設定', click: ()=>{ openFavoriteWindow() } },
        { type: 'separator' },
        { label: '終了', accelerator: 'Command+Q', click: ()=>{ app.quit() } }
      ]
  })
  menu.show()

  // システムトレイ
  tray.setContextMenu([
    {
      label: 'すべて',
      click: ()=>{
        window.main.show()
        window.main.send('index-window-show', 0)
      }
    },
    {
      label: 'お気に入り',
      click: ()=>{
        window.main.show()
        window.main.send('index-window-show', 1)
      }
    },
    { type: 'separator' },
    { label: 'お気に入り設定', click: ()=>{ openFavoriteWindow() } },
    { label: '環境設定', click: ()=>{ openSettingsWindow() } },
    { type: 'separator' },
    { label: '終了', click: ()=>{ app.quit() } }
  ])
  tray.show()

  // PeerCast起動
  peercast.start()

  // メインウィンドウ
  const {width, height, x, y} = config.get('bounds')
  window.main = new BrowserWindow({
    width: width,
    height: height,
    minWidth: 150,
    x: x,
    y: y,
    frame: true,
    scrollBounce: true,
    icon: `${__dirname}/../src/img/icon/icon_1024x1024.png`,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    }
  })
  window.main.loadURL(`file://${__dirname}/index.html`)

  // 非アクティブ時
  window.main.on('blur', (event, arg)=>{
    event.sender.send('index-window-blur')
  })

  // アクティブ時
  window.main.on('focus', (event, arg)=>{
    event.sender.send('index-window-focus')
  })

  // 閉じた時
  window.main.on('close', ()=>{
    config.set('bounds', window.main.getBounds())
    window.main = null
  })
})

/*-----------------------------------------
  すべてのウィンドウが閉じられた時
-----------------------------------------*/
app.on('window-all-closed', ()=>{
  if(config.get('exitPeercast')) peercast.stop()
  if(process.platform != 'darwin') app.quit()
})

/*-----------------------------------------
  イベントをバインド
-----------------------------------------*/
// ------- index.txtを取得して返す -------
ipcMain.on('asyn-yp', (event, ypList) => {
  let getChannelsPromises = ypList.map((yp) => {
    return new Promise((resolve, reject) => {
      request.get(yp.url + 'index.txt', { timeout: 15000 })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        })
    })
  })
  Promise.all(getChannelsPromises).then((responses) => {
    let channels = responses.map((res) => {
      return { txt: res.data, url: res.config.url }
    })
    event.sender.send('asyn-yp-reply', channels)
  }).catch((e) => {
    console.log(e)
    event.sender.send('asyn-yp-reply', [])
  })
})

// ---------- 再生プレイヤーの起動 ----------
ipcMain.on('asyn-play', (event, player, args) =>{
  let command
  if (global.process.platform == 'darwin' && player.match(/.+\.app$/)) {
    // macOSでAPP形式の場合はopenコマンドで実行
    command = `open -a ${player} -n --args ${args}`
  }else{
    command = `${player} ${args}`
  }
  try{
    exec(command, (error, stdout, stderr)=>{
      console.log(stdout)
    })
  }catch(e){
    console.log(e)
  }
})

// ------------- BBSブラウザの起動 -------------
ipcMain.on('asyn-open-bbs', (event, url, name) => {
  let command
  if (global.process.platform == 'darwin') {
    // -nオプションで多重起動を許可する
    command = `open -a ${config.get('bbs')} -n --args '${url}' '${name}'`
  }else{
    command = `${config.get('bbs')} '${url}' '${name}'`
  }
  try{
    exec(command, (error, stdout, stderr)=>{
      console.log(stdout)
    })
  }catch(e){
    console.log(e)
  }
})

// ---------- お気に入りウィンドウを開く ----------
ipcMain.on('asyn-favorite-window', (event) =>{
  openFavoriteWindow()
})

// ---------- お気に入りウィンドウを閉じる ----------
ipcMain.on('asyn-favorite-window-close', (event) =>{
  closeFavoriteWindow()
})

// ------------- 設定ウィンドウを開く -------------
ipcMain.on('asyn-settings-window', (event) =>{
  openSettingsWindow()
})

// ------------ 設定ウィンドウを閉じる ------------
ipcMain.on('asyn-settings-window-close', (event) =>{
  closeSettingsWindow()
})

// --------- [MacOS]トレイアイコンをセット ---------
ipcMain.on('asyn-set-trayicon', (event, platform) =>{
  if(global.process.platform=='darwin'){
    tray.setImage(platform)
  }
})

/*-----------------------------------------
  functions
-----------------------------------------*/
const openFavoriteWindow = ()=>{
  if(window.favorite == null){
    let bounds = getChildBoundsFromMain(490, 375)
    window.favorite = new BrowserWindow({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      center: false,
      frame: false,
      alwaysOnTop: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      }
    })
    window.favorite.loadURL(`file://${__dirname}/favorite.html`)
    window.main.setIgnoreMouseEvents(true)
  }
}

const closeFavoriteWindow = ()=>{
  window.favorite.close()
  window.favorite = null
  window.main.setIgnoreMouseEvents(false)
  window.main.send('asyn-favorite-window-close-reply')
}

const openSettingsWindow = ()=>{
  if(window.settings == null){
    let bounds = getChildBoundsFromMain(400, 350)
    window.settings = new BrowserWindow({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      center: false,
      frame: false,
      alwaysOnTop: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      }
    })
    window.settings.loadURL(`file://${__dirname}/settings.html`)
    window.main.setIgnoreMouseEvents(true)
  }
}

const closeSettingsWindow = ()=>{
  window.settings.close()
  window.settings = null
  systemPreferences.setAppLevelAppearance(config.get('theme'))
  window.main.setIgnoreMouseEvents(false)
  window.main.send('asyn-settings-window-close-reply')
}

// window.mainの中心の相対座標を取得
const getChildBoundsFromMain = (childWidth, childHeight)=>{
  let parrent = window.main.getBounds()
  let x = Math.round(
    parrent.x + (parrent.width/2) - (childWidth/2)
  )
  let y = Math.round(
    parrent.y + (parrent.height/2) - (childHeight/2)
  )
  return { x: x, y: y, width: childWidth, height: childHeight }
}
