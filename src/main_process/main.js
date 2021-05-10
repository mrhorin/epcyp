import { systemPreferences, ipcMain, app, BrowserWindow, Tray, Menu, shell } from 'electron'
import { exec, spawn } from 'child_process'
import request from 'axios'
import Config from 'electron-store'

import TrayManager from 'main_process/tray_manager'
import MenuManager from 'main_process/menu_manager'
import PeercastManager from 'main_process/peercast_manager'

const config = new Config({
  defaults: {
    bounds: { width: 300, height: 600 },
    playerPath: '',
    playerArgs: '"$x"',
    bbs: "",
    theme: 'light',
    ffmpeg: 'ffmpeg',
    recPath: '~/'
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
app.on('ready', () => {
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
    {
      label: '検索',
      click: ()=>{
        window.main.show()
        window.main.send('index-window-show', 2)
      }
    },
    {
      label: '録画',
      click: ()=>{
        window.main.show()
        window.main.send('index-window-show', 3)
      }
    },
    {
      label: 'リレー',
      click: ()=>{
        window.main.show()
        window.main.send('index-window-show', 4)
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
  let { width, height, x, y } = config.get('bounds')
  let baseColor = config.get('theme') == 'dark' ? '#444444' : '#f5f4f5'
  window.main = new BrowserWindow({
    width: width,
    height: height,
    minWidth: 150,
    backgroundColor: baseColor,
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
app.on('will-quit', ()=>{
  if(config.get('exitPeercast')) peercast.stop()
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
          resolve(err)
        })
    })
  })
  Promise.all(getChannelsPromises).then((responses) => {
    let channels = responses.map((res) => {
      if (res.status && res.status == 200) {
        return { txt: res.data, url: res.config.url }
      } else {
        return { txt: '', url: res.config.url}
      }
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

// ---------- 録画開始 ----------
let records = [] // 録画channelリスト
ipcMain.on('start-record', (event, channel, path) => {
  try {
    event.sender.send('start-record-reply', channel)
    // リレー開始
    exec(`curl ${channel.playListURL}`, (error, stdout, stderr) => {
      if (error) {
        console.log(stderr)
        event.sender.send('stop-record', channel)
      } else {
        // 二重録画予防
        let index = findIndexOfRecs(channel)
        if (index < 0) {
          records.push(channel)
          // ffmpeg起動
          const ffmpeg = spawn(config.get('ffmpeg'), ['-i', channel.streamURL, '-progress', '-', '-c', 'copy', path])
          // 録画情報更新
          ffmpeg.stderr.on('data', (data) => {
            console.log(data.toString())
          })
          ffmpeg.stdout.on('data', (data) => {
            console.log(data.toString())
            event.sender.send('update-record-info', channel, ffmpeg.pid, data.toString())
          })
          // 停止
          ffmpeg.on('close', (code) => {
            let index = findIndexOfRecs(channel)
            records.splice(index, 1)
            event.sender.send('stop-record', channel, ffmpeg.pid, code)
          })
        } else {
          console.log(`${channel.name} is still being recorded`)
        }
      }
    })
  }catch(e){
    console.log(e)
  }
})

// ---------- 録画停止 ----------
ipcMain.on('stop-record', (event, pid) => {
  try {
    if (pid) process.kill(pid)
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
    let baseColor = config.get('theme') == 'dark' ? '#444444' : '#f5f4f5'
    window.favorite = new BrowserWindow({
      x: bounds.x,
      y: bounds.y,
      backgroundColor: baseColor,
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
    let baseColor = config.get('theme') == 'dark' ? '#444444' : '#f5f4f5'
    window.settings = new BrowserWindow({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      backgroundColor: baseColor,
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

const findIndexOfRecs = (channel) => {
  let index = -1
  for (let i = 0; i < records.length; i++){
    if (records[i].streamURL == channel.streamURL) {
      index = i
      break
    }
  }
  return index
}