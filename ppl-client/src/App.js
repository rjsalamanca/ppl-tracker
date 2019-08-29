import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import { Nav, Button } from 'react-bootstrap';

import NavBar from './components/navBar';
import LandingPage from './components/landingPage';
import Test from './components/test';

import './App.css';

class App extends Component {
  state = {

  }
  render() {
    return (
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/test" exact component={Test} />

          {/* <Route path="/login" exact render={(props) => <Login {...props} user={this.state} changeLoginState={this.changeLoginState} />} />
          <Route path="/register" exact render={(props) => <Register {...props} user={this.state} changeLoginState={this.changeLoginState} />} />
          <Route path="/logout" exact render={(props) => <Logout {...props} user={this.state} changeLoginState={this.changeLoginState} />} />
          <Route path="/profile" exact render={(props) => <Profile {...props} user={this.state} changeLoginState={this.changeLoginState} />} />
          <Route path="/scores" render={(props) => <Scores {...props} user={this.state} changeLoginState={this.changeLoginState} />} />
          <Route path="/play" component={Play} />
          <Route render={() => <Redirect to="/" />} /> */}
        </Switch>
      </Router>
    );
  }
}

export default App;
