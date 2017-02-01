import {Tray, Menu} from 'electron'

/*---------------------------------------
  システムトレイを操作するクラス
----------------------------------------*/
module.exports = class TrayManager{

  constructor(iconPath){
    this.tray = null
    this.trayIcon = iconPath
    this.trayContextMenu  = null
  }

  show(){
    this.tray = new Tray(this.trayIcon)
    this.tray.setToolTip('PCLounge')
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
