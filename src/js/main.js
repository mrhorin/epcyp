import electron from 'electron'
import request from 'superagent'
import path from 'path'
import Config from 'electron-config'
import {exec} from 'child_process'
const ipcMain = electron.ipcMain
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const config = new Config({
  defaults: { bounds: { width: 800, height: 600 } }
})

var mainWindow = null

// 起動準備ができた時
app.on('ready', ()=>{
  const {width, height, x, y} = config.get('bounds')
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: x,
    y: y,
    frame: false,
    titleBarStyle: 'hidden-inset',
    scrollBounce: true
  })
  // mainWindow.openDevTools()
  mainWindow.loadURL(`file://${path.resolve(path.join('dist', 'index.html'))}`)

  mainWindow.on('close', ()=>{
    config.set('bounds', mainWindow.getBounds())
    mainWindow = null
  })
})

// すべてのウィンドウが閉じた時
app.on('window-all-closed', ()=>{
  if(process.platform != 'darwin') app.quit()
})

// index.txtの取得
ipcMain.on('asyn-yp', (event, yp)=>{
  try{
    request.get(yp.url).end((err,res)=>{
      yp["txt"] = res.status == 200 && !res.error ? res.text : null
      // yp["txt"] = if res.status == 200 && !res.error then res.text else null
      event.sender.send('asyn-yp-reply', yp)
    })
  }
  catch(e){
    console.log(e)
  }
})

// プレイヤーの起動
ipcMain.on('asyn-play', (event, channel, url) =>{
  var command = `open -a /Applications/VLC.app ${url}`
  exec(command, (error, stdout, stderr)=>{
    console.log(stdout)
  })
})
