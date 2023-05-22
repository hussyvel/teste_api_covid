
import { render } from "@testing-library/react";
import React, {Component} from "react";
import Header from './components/Header';

import CovidBox  from './components/Covid';
class App extends Component {
  render () {
    return (
    <div className="container">
      <Header title="Benchmarks Covid 19"/>
      <br />
      <CovidBox />
    </div>
  );
  }
}
export default App;
