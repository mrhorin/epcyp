electron = require 'electron'
request = require 'superagent'
ipc = electron.ipcMain;

# request.get("http://bayonet.ddo.jp/sp/index.txt").end((err,res)->
#   console.log res.text
# )

app = electron.app
BrowserWindow = electron.BrowserWindow

mainWindow = null

app.on('window-all-closed', ()->
  if process.platform != 'darwin'
    app.quit()
)

app.on('ready', ()->

  # ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.openDevTools()
  mainWindow.loadURL('file://' + __dirname + '/index.html')

  mainWindow.on('closed', ()->
    mainWindow = null
  )
)

ipc.on('asynchronous-message', (event, arg) =>
  console.log(arg)
  event.sender.send('asynchronous-reply', 'reply from main.')
)
