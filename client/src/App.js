import './App.css';
import React, { Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';


function App() {
  return (
    <Router>
      <Fragment>
      <Navbar />
      <Route exact path="/" component={ Landing } />
      {/* <Landing /> */}
      </Fragment>
    </Router>
  );
}

export default App;
