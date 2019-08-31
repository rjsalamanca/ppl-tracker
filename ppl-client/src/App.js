import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NavBar from './components/navBar';
import LandingPage from './components/landingPage';
import LoginPage from './components/loginPage';

import './App.css';

class App extends Component {
  state = {
    is_logged_in: false
  }

  checkLoginStatus = async () => {
    const url = "http://localhost:3000/users/loginStatus";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      })

      const data = await response.json();

      this.setState({ is_logged_in: data.is_logged_in });
      console.log("IN CHECK LOGIN STATUS: ", this.state.is_logged_in)
    } catch (err) {
      return err.message;
    }
  }

  render() {

    return (
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/login" exact render={(props) => <LoginPage />} />

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
