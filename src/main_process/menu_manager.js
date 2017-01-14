import {Menu} from 'electron'

/*---------------------------------------
  アプリケーションメニューを操作するクラス
----------------------------------------*/
module.exports = class MenuManager{

  constructor(){
    this.menu = null
    this.template = []
  }

  show(){
    this.menu = Menu.buildFromTemplate(this.template)
    Menu.setApplicationMenu(this.menu)
  }

  setContextMenu(template){
    this.template = this.template.concat(template)
  }

  // Mac環境の場合のみセット
  setMacContextMenu(menuItem){
    if(global.process.platform == 'darwin'){
      this.template.unshift(menuItem)
    }
  }

}
