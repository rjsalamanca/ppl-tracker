import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NavBar from './components/navBar';
import LandingPage from './components/landingPage';
import LoginPage from './components/users/loginPage';
import RegisterPage from './components/users/registerPage';
import ProfilePage from './components/system/profilePage';
import CreateRoutine from './components/system/routine_creation/createRoutine';

import PrivateRoute from './PrivateRoute';

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

   return (
      <Router>
         <UserContext.Provider value={userValues}>
            <NavBar />
            <PrivateRoute path="/" exact render={(props) => < LandingPage {...props} />} />
            <PrivateRoute path="/login" exact render={(props) => <LoginPage {...props} />} />
            <PrivateRoute path="/register" exact render={(props) => <RegisterPage {...props} />} />
            <PrivateRoute path="/profile" exact render={(props) =>
               <RoutineContext.Provider value={routineValues}>
                  <ProfilePage {...props} />
               </RoutineContext.Provider>
            } />

            <PrivateRoute path="/ppl/create_routine" exact render={(props) =>
               <CreateRoutineContext.Provider value={createRoutineValues}>
                  <CreateRoutine {...props} />
               </CreateRoutineContext.Provider>
            } />
         </UserContext.Provider>

      </Router>
   );
}

export default App;
