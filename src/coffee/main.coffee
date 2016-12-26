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
ipcMain.on('asyn-yp', (event, yp) ->
  console.log(yp)
  try
    request.get(yp.url).end((err,res)->
      yp["txt"] = if res.status == 200 && !res.error then res.text else null
      event.sender.send('asyn-yp-reply', yp)
    )
  catch e
    console.log e
)
