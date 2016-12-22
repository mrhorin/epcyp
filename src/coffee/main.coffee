electron = require 'electron'
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
  mainWindow.loadURL('file://' + __dirname + '/index.html')

  mainWindow.on('closed', ()->
    mainWindow = null
  )
)
