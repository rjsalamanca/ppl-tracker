import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from './components/navBar';
import LandingPage from './components/landingPage';
import LoginPage from './components/users/loginPage';
import RegisterPage from './components/users/registerPage';
import ProfilePage from './components/system/profilePage';
import CreateRoutine from './components/system/routine_creation/createRoutine';

import PrivateRoute from './components/PrivateRoute';

import { CookiesProvider } from 'react-cookie';
import { useCookies } from 'react-cookie';
import { UserContext } from './contexts/UserContext';

import RoutineContextProvider from './components/providers/CreateRoutineProvider';

import './App.css';

function App() {
   // Cookies
   // const [cookies, setCookie] = useCookies(['user']);

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
   // const [routineName, setRoutineName] = useState('');
   // const [routineDays, setRoutineDays] = useState([]);
   // const [tempExercises, setTempExercises] = useState([]);

   // const createRoutineValues = useMemo(() => (
   //    {
   //       routineName, setRoutineName,
   //       routineDays, setRoutineDays,
   //       tempExercises, setTempExercises
   //    }
   // ),
   //    [
   //       routineName, setRoutineName,
   //       routineDays, setRoutineDays,
   //       tempExercises, setTempExercises
   //    ]
   // );

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
      <CookiesProvider>
         <Router>
            <UserContext.Provider value={userValues}>
               <NavBar />
               <Switch>
                  <Route path="/" exact render={(props) => < LandingPage {...props} />} />
                  <Route path="/login" exact render={(props) => <LoginPage {...props} />} />
                  <Route path="/register" exact render={(props) => <RegisterPage {...props} />} />
               </Switch>
               {/* {!!cookies.user.isLoggedIn && */}
               <PrivateRoute path="/ppl/create_routine" exact ContextProvider={RoutineContextProvider} LoadComponent={CreateRoutine} />

               {/* <Switch> 
                  <PrivateRoute path="/ppl/create_routine" exact render={(props) =>
                     <CreateRoutineContext.Provider value={createRoutineValues}>
                        <CreateRoutine {...props} />
                     </CreateRoutineContext.Provider>
                  } />
               </Switch> */}

               {/* {!!cookies.user.isLoggedIn && */}

               {/* <Switch> */}
               {/* <PrivateRoute path="/profile" exact render={(props) =>
                  <RoutineContext.Provider value={routineValues}>
                     <ProfilePage {...props} />
                  </RoutineContext.Provider>
               } /> */}
               {/* </Switch> */}

            </UserContext.Provider>
         </Router>
      </CookiesProvider>

   );
}

export default App;
