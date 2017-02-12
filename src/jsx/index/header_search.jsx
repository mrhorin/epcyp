import React from 'react'
import {ipcRenderer} from 'electron'

module.exports = class HeaderSearch extends React.Component {

  constructor(props){
    super(props)
    this.search = this.search.bind(this)
  }

  search(event){
    if(event.type=='keypress'&&event.charCode==13||event.type=='click'){
      this.props.setSearchWord(this.refs.searchWord.value)
    }
  }

  render(){
    return(
      <div className="search-group">
        <input ref="searchWord" type="text" onKeyPress={this.search} />
        <button className="btn btn-default" onKeyDown={this.search} onClick={this.search}>
          <span className="icon icon-search" />
        </button>
      </div>
    )
  }

}
