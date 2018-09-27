import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import './App.css';
import Products from './components/Products';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Crypto Tracker</h1>
          <h6>Here you can see and compare your desire product among all choices that we provided for you...</h6>
        </header>
        <Products/>
      </div>
    );
  }
}

export default App;
