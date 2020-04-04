import React, { useState, useEffect, useMemo } from 'react';
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

import CreateRoutineContextProvider from './components/providers/CreateRoutineProvider';
import RoutineProvider from './components/providers/RoutineProvider';

import './App.css';

function App() {
   const [run, setRun] = useState(true);
   const [cookies, setCookie] = useCookies(['user']);

   useEffect(() => {
      runOnce();
   }, [cookies]);

   const runOnce = () => {
      if (!!cookies.hasOwnProperty('user')) {
         return setRun(
            <Router>
               <NavBar />
               <Switch>
                  <Route path="/" exact render={(props) => < LandingPage {...props} />} />
                  <Route path="/login" exact render={(props) => <LoginPage {...props} />} />
                  <Route path="/register" exact render={(props) => <RegisterPage {...props} />} />
               </Switch>
               <PrivateRoute path="/ppl/create_routine" exact ContextProvider={CreateRoutineContextProvider} LoadComponent={CreateRoutine} />
               <PrivateRoute path="/profile" exact ContextProvider={RoutineProvider} LoadComponent={ProfilePage} />
            </Router>
         )
      } else {
         setCookie('user', { isLoggedIn: false })
         console.log(cookies)
         return setRun(<div>hi</div>)
      }
   }

   return (
      <CookiesProvider>
         {run}
      </CookiesProvider>
   );
}

export default App;
