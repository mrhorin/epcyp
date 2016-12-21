import React from "react";
import ReactDOM from "react-dom";
import cats from "../js/cats";

// コンポーネント
class Test extends React.Component {
  render(){
    return (
      <h1>React.jsの{cats}テスト</h1>
    );
  }
}
// レンダリング
ReactDOM.render(
  <Test />,
  document.getElementById('container')
);
