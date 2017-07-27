import {Tray, Menu} from 'electron'

/*---------------------------------------
  システムトレイを操作するクラス
----------------------------------------*/
module.exports = class TrayManager{

  constructor(){
    this.tray = null
    this.iconPath = {
      darwin: `${__dirname}/../src/img/icon/darwin/iconTemplate.png`,
      linux: `${__dirname}/../src/img/icon/linux/iconTemplate.png`
    }
    this.platform = global.process.platform == 'darwin' ? 'darwin' : 'linux'
    this.trayContextMenu  = null
  }

  show(){
    if(this.platform == 'darwin'){
      this.tray = new Tray(this.iconPath.darwin)
    }else{
      this.tray = new Tray(this.iconPath.linux)
    }
    this.tray.setToolTip('epcyp')
    this.tray.setContextMenu(this.trayContextMenu)
  }

  hide(){
    this.tray.destroy()
  }

  setContextMenu(template){
    this.trayContextMenu = Menu.buildFromTemplate(template)
  }

  setImage(platform){
    this.tray.setImage(this.iconPath[platform])
  }

  bindEvents(){
  }

}
