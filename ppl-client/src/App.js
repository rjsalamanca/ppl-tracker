import React, { useState, useMemo } from 'react';
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

   const userValues = useMemo(() => (
      {
         isLoggedIn, setIsLoggedIn
      }
   ),
      [
         isLoggedIn, setIsLoggedIn
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
            <Switch>
               <Route path="/" exact component={LandingPage} />
               <Route path="/login" exact render={(props) => <LoginPage {...props} />} />
               <Route path="/register" exact render={(props) => <RegisterPage {...props} />} />

               <Route path="/profile" exact render={(props) =>
                  <RoutineContext.Provider value={routineValues}>
                     <ProfilePage {...props} />
                  </RoutineContext.Provider>
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
