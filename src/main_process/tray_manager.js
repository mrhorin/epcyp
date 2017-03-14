import {Tray, Menu} from 'electron'

/*---------------------------------------
  システムトレイを操作するクラス
----------------------------------------*/
module.exports = class TrayManager{

  constructor(){
    this.tray = null
    let platform = global.process.platform == 'darwin' ? 'darwin' : 'linux'
    this.trayIcon = `${__dirname}/../src/img/icon/${platform}/icon_tray.png`
    this.trayContextMenu  = null
  }

  show(){
    this.tray = new Tray(this.trayIcon)
    this.tray.setToolTip('epcyp')
    this.tray.setContextMenu(this.trayContextMenu)
  }

  hide(){
    this.tray.destroy()
  }

  setContextMenu(template){
    this.trayContextMenu = Menu.buildFromTemplate(template)
  }

  bindEvents(){
  }

}
