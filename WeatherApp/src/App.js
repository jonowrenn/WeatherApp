import logo from './logo.svg';
import './App.css';
import React from 'react';
import './App.css';
import WeatherApp from '/Users/jonathanwrenn/Desktop/WeatherApp/weatherapp/src/WeatherApp'; // Make sure the path is correct


function App() {
  return (
    <div className="App">
      <WeatherApp/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
