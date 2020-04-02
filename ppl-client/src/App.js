import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NavBar from './components/navBar';
import LandingPage from './components/landingPage';
import LoginPage from './components/users/loginPage';
import RegisterPage from './components/users/registerPage';

import ProfilePage from './components/system/profilePage';
import CreateRoutine from './components/system/routine_creation/createRoutine';

import { UserContext } from './UserContext';

import './App.css';

function App() {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [selectedWorkout, setSelectedWorkout] = useState({});
   const [date, setDate] = useState(new Date());
   const [fullRoutine, setFullRoutine] = useState({ routine_found: false });


   const value = useMemo(() => (
      {
         isLoggedIn, setIsLoggedIn,
         selectedWorkout, setSelectedWorkout,
         date, setDate,
         fullRoutine, setFullRoutine
      }
   ),
      [
         isLoggedIn, setIsLoggedIn,
         selectedWorkout, setSelectedWorkout,
         date, setDate,
         fullRoutine, setFullRoutine
      ]
   );

   return (
      <Router>
         <UserContext.Provider value={value}>
            <NavBar />
            <Switch>
               <Route path="/" exact component={LandingPage} />
               <Route path="/login" exact render={(props) => <LoginPage {...props} />} />
               <Route path="/register" exact render={(props) => <RegisterPage {...props} />} />
               <Route path="/profile" exact render={(props) => <ProfilePage {...props} />} />
               <Route path="/ppl/create_routine" exact render={(props) => <CreateRoutine {...props} />} />
            </Switch>
         </UserContext.Provider>

      </Router>
   );
}

export default App;
