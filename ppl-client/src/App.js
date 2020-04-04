import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import NavBar from './components/navBar';
import LandingPage from './components/landingPage';
import LoginPage from './components/users/loginPage';
import RegisterPage from './components/users/registerPage';
import ProfilePage from './components/system/profilePage';
import CreateRoutine from './components/system/routine_creation/createRoutine';

import PrivateRoute from './components/PrivateRoute';

import { UserContext } from './contexts/UserContext';
import { CookiesProvider } from 'react-cookie';
import { useCookies } from 'react-cookie';

import CreateRoutineContextProvider from './components/providers/CreateRoutineProvider';
import RoutineProvider from './components/providers/RoutineProvider';

import './App.css';

function App() {
   const [run, setRun] = useState(true);
   const [update, setUpdate] = useState(false);
   const [cookies, setCookie] = useCookies(['user']);
   const [cookieCheck, setCookieCheck] = useState(cookies);

   useEffect(() => {
      setCookieCheck(cookies);
      runContent();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [cookies, update, cookieCheck]);

   const runContent = () => {
      if (!!cookies.hasOwnProperty('user')) {
         return setRun(
            <Router>
               <NavBar />
               <Switch>
                  <Route path="/" exact render={(props) => < LandingPage {...props} />} />
                  <Route path="/login" exact render={(props) => {
                     // console.log(cookies);
                     return !!cookies.user.isLoggedIn ? <Redirect to="/" /> : <LoginPage {...props} />
                  }
                  } />
                  <Route path="/register" exact render={(props) => !!cookies.user.isLoggedIn ? <Redirect to="/" /> : < RegisterPage {...props} />} />
               </Switch>
               <PrivateRoute path="/ppl/create_routine" exact ContextProvider={CreateRoutineContextProvider} LoadComponent={CreateRoutine} />
               <PrivateRoute path="/profile" exact ContextProvider={RoutineProvider} LoadComponent={ProfilePage} />
            </Router>
         )
      } else {
         setCookie('user', { isLoggedIn: false })
         return setRun(<div>hi</div>)
      }
   }

   return (
      <CookiesProvider>
         <UserContext.Provider value={{ update, setUpdate }}>
            {run}
         </UserContext.Provider>
      </CookiesProvider>
   );
}

export default App;
