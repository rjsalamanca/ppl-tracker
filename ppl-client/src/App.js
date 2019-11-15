import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NavBar from './components/navBar';
import LandingPage from './components/landingPage';
import LoginPage from './components/users/loginPage';
import LogoutPage from './components/users/logoutPage';
import RegisterPage from './components/users/registerPage';

import ProfilePage from './components/system/profilePage';
import CreateRoutine from './components/system/createRoutine';

import './App.css';

class App extends Component {
  state = {
    is_logged_in: false
  }

  changeToLogout = async () => {
    this.setState({ is_logged_in: false });
  }

  checkLoginStatus = async () => {
    const url = "http://localhost:3000/users/loginStatus";

    try {
      const response = await fetch(url, {
        method: 'GET',
        // headers: {
        //   "Accept": "application/json",
        //   "Content-Type": "application/json"
        // },
        credentials: 'include'
      })

      const data = await response.json();
      this.setState({ is_logged_in: data.is_logged_in })

      return 'yes';
    } catch (err) {
      console.log(this.state.is_logged_in)
      return err.message;
    }
  }

  render() {

    return (
      <Router>
        <NavBar is_logged_in={this.state.is_logged_in} checkLoginStatus={this.checkLoginStatus} />
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/login" exact render={(props) => <LoginPage {...props} is_logged_in={this.state.is_logged_in} checkLoginStatus={this.checkLoginStatus} />} />
          <Route path="/logout" exact render={(props) => <LogoutPage {...props} is_logged_in={this.state.is_logged_in} changeToLogout={this.changeToLogout} checkLoginStatus={this.checkLoginStatus} />} />
          <Route path="/register" exact render={(props) => <RegisterPage {...props} />} />
          <Route path="/profile" exact render={(props) => <ProfilePage {...props} is_logged_in={this.state.is_logged_in} checkLoginStatus={this.checkLoginStatus} />} />
          <Route path="/ppl/create_routine" exact render={(props) => <CreateRoutine {...props} />} />

          {/* 
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
