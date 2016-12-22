import React from "react";
import ReactDOM from "react-dom"
import css from "scss/style"
import yp from "coffee/yp"

// コンポーネント
class Test extends React.Component {
  render(){
    return (
      <h1>React.jsテスト{yp["TP"]}</h1>
    )
  }
}

// レンダリング
ReactDOM.render(
  <Test />,
  document.getElementById('container')
)
