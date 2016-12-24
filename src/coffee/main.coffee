electron = require 'electron'
request = require 'superagent'
ipcMain = electron.ipcMain
app = electron.app
BrowserWindow = electron.BrowserWindow

app.on('ready', ()->
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.openDevTools()
  mainWindow.loadURL('file://' + __dirname + '/index.html')

  mainWindow.on('closed', ()->
    mainWindow = null
  )
)

# すべてのウィンドウが閉じた時
app.on('window-all-closed', ()->
  if process.platform != 'darwin'
    app.quit()
)

# index.txtのURL受信時
ipcMain.on('asyn-yp', (event, url) ->
  try
    request.get(url).end((err,res)->
      if res.status == 200 && !res.error
        event.sender.send('asyn-yp-reply', res.text)
      else
        event.sender.send('asyn-yp-reply', null)
    )
  catch
    event.sender.send('asyn-yp-reply', null)
)
