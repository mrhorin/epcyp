import React from 'react'
import {ipcRenderer} from 'electron'

module.exports = class HeaderSearch extends React.Component {

  constructor(props){
    super(props)
    this.search = this.search.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  search(event){
    if(event.type=='keypress'&&event.charCode==13||event.type=='click'){
      this.props.setSearchWord(this.refs.searchWord.value)
    }
  }

  cancel(){
    this.refs.searchWord.value = ""
  }

  render(){
    return (
      <div className="flex-header-search">
        <div className="search-group">
          <input id="search-word" ref="searchWord" type="text" onKeyPress={this.search} />
          <button id="search-cancel" className="btn btn-default" onKeyDown={this.search} onClick={this.cancel}>
            <span className="icon icon-cancel" />
          </button>
          <button id="search-submit" className="btn btn-default" onKeyDown={this.search} onClick={this.search}>
            <span className="icon icon-search" />
          </button>
        </div>
      </div>
    )
  }

}
