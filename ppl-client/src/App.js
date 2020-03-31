import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NavBar from './components/navBar';
import LandingPage from './components/landingPage';
import LoginPage from './components/users/loginPage';
import LogoutPage from './components/users/logoutPage';
import RegisterPage from './components/users/registerPage';

import ProfilePage from './components/system/profilePage';
import CreateRoutine from './components/system/routine_creation/createRoutine';

import { UserContext } from './UserContext';

import './App.css';

function App() {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const value = useMemo(() => ({ isLoggedIn, setIsLoggedIn }), [isLoggedIn, setIsLoggedIn]);

   // state = {
   //    is_logged_in: false
   // }

   // const changeToLogout = async () => {
   //    setIs_logged_in(false);
   // }

   // const checkLoginStatus = async () => {
   //    const url = "http://localhost:3000/users/loginStatus";

   //    try {
   //       const response = await fetch(url, {
   //          method: 'GET',
   //          headers: {
   //             "Accept": "application/json",
   //             "Content-Type": "application/json"
   //          },
   //          credentials: 'include'
   //       })

   //       const data = await response.json();
   //       setIs_logged_in(data.is_logged_in)
   //       // this.setState({ is_logged_in: data.is_logged_in })

   //       return 'yes';
   //    } catch (err) {
   //       // console.log(this.state.is_logged_in)
   //       return err.message;
   //    }
   // }


   return (
      <Router>
         <UserContext.Provider value={value}>
            <NavBar />
            <Switch>
               <Route path="/" exact component={LandingPage} />
               <Route path="/login" exact render={(props) => <LoginPage {...props} />} />
               <Route path="/logout" exact render={(props) => <LogoutPage {...props} />} />
               <Route path="/register" exact render={(props) => <RegisterPage {...props} />} />
               <Route path="/profile" exact render={(props) => <ProfilePage {...props} />} />
               <Route path="/ppl/create_routine" exact render={(props) => <CreateRoutine {...props} />} />
            </Switch>
         </UserContext.Provider>

      </Router>
   );
}

export default App;
