import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NavBar from './components/navBar';
import LandingPage from './components/landingPage';
import LoginPage from './components/users/loginPage';
import RegisterPage from './components/users/registerPage';

import ProfilePage from './components/system/profilePage';
import CreateRoutine from './components/system/routine_creation/createRoutine';

import { UserContext } from './contexts/UserContext';
import { CreateRoutineContext } from './contexts/CreateRoutineContext';
import { RoutineContext } from './contexts/RoutineContext';

import './App.css';

function App() {
   // User Context
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [userLocation, setUserLocation] = useState('');

   const userValues = useMemo(() => (
      {
         isLoggedIn, setIsLoggedIn,
         userLocation, setUserLocation
      }
   ),
      [
         isLoggedIn, setIsLoggedIn,
         userLocation, setUserLocation
      ]
   );

   // CreateRoutineContext 
   const [routineName, setRoutineName] = useState('');
   const [routineDays, setRoutineDays] = useState([]);
   const [tempExercises, setTempExercises] = useState([]);

   const createRoutineValues = useMemo(() => (
      {
         routineName, setRoutineName,
         routineDays, setRoutineDays,
         tempExercises, setTempExercises
      }
   ),
      [
         routineName, setRoutineName,
         routineDays, setRoutineDays,
         tempExercises, setTempExercises
      ]
   );

   //Routine Context
   const [selectedWorkout, setSelectedWorkout] = useState({});
   const [date, setDate] = useState(new Date());
   const [fullRoutine, setFullRoutine] = useState({ routine_found: false });

   const routineValues = useMemo(() => (
      {
         selectedWorkout, setSelectedWorkout,
         date, setDate,
         fullRoutine, setFullRoutine
      }
   ),
      [
         selectedWorkout, setSelectedWorkout,
         date, setDate,
         fullRoutine, setFullRoutine
      ]
   );

   const checkLoginStatus = async () => {
      const url = "http://localhost:3000/users/loginStatus";

      fetch(url, {
         method: "GET",
         credentials: "include"
      }).then(response => {

      }).then(err => {
         console.log(err);
         return err;
      });

      // try {
      //    const response = await fetch(url, {
      //       method: "GET",
      //       credentials: "include"
      //    })
      //    const data = await response.json();
      //    console.log(data)
      //    setIsLoggedIn(true);
      //    return data.is_logged_in
      // } catch (err) {
      //    setIsLoggedIn(false);
      //    return false
      // }
   }

   return (
      <Router>
         <UserContext.Provider value={userValues}>
            <NavBar />
            <Switch>
               <Route path="/" exact render={(props) => < LandingPage {...props} />} />
               <Route path="/login" exact render={(props) => <LoginPage {...props} />} />
               <Route path="/register" exact render={(props) => <RegisterPage {...props} />} />

               <Route path="/profile" exact render={(props) =>
                  !!checkLoginStatus() ?
                     <RoutineContext.Provider value={routineValues}>
                        <ProfilePage {...props} />
                     </RoutineContext.Provider>
                     :
                     console.log('no')

               } />

               <Route path="/ppl/create_routine" exact render={(props) =>
                  <CreateRoutineContext.Provider value={createRoutineValues}>
                     <CreateRoutine {...props} />
                  </CreateRoutineContext.Provider>
               } />
            </Switch>
         </UserContext.Provider>

      </Router>
   );
}

export default App;
