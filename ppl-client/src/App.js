import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import NavBar from './components/navBar';
import LandingPage from './components/landingPage';
import LoginPage from './components/users/loginPage';
import RegisterPage from './components/users/registerPage';
import ProfilePage from './components/system/profilePage';
import CreateRoutine from './components/system/routine_creation/createRoutine';
import EditRoutines from './components/system/editRoutines';
import TrackProgress from './components/system/trackProgress';

import PrivateRoute from './components/PrivateRoute';

import { UserContext } from './contexts/UserContext';
import { CookiesProvider } from 'react-cookie';
import { useCookies } from 'react-cookie';

import CreateRoutineContextProvider from './components/providers/CreateRoutineProvider';
import RoutineProvider from './components/providers/RoutineProvider';

import './App.css';

function App() {
   const [run, setRun] = useState(true);
   const [loggedIn, setLoggedIn] = useState(false);
   const [update, setUpdate] = useState(0);
   const [cookies, setCookie] = useCookies(['user']);
   const [cookieCheck, setCookieCheck] = useState(cookies);

   const createUserValues = useMemo(() => (
      {
         loggedIn, setLoggedIn,
         update, setUpdate
      }
   ),
      [
         loggedIn, setLoggedIn,
         update, setUpdate
      ]
   );

   // useEffect(() => {
   //    console.log('changed loggedIn')
   //    if (!!cookies.hasOwnProperty('user')) {
   //       if (cookies.user.hasOwnProperty('isLoggedIn')) {

   //          !!cookies.user.isLoggedIn ? setLoggedIn(true) : setLoggedIn(false);
   //       } else {
   //          setLoggedIn(false)
   //       }
   //    } else {
   //       setLoggedIn(false);
   //    }
   //    setUpdate(update + 1);
   //    console.log('going to update')
   // }, [loggedIn])

   useEffect(() => {
      if (!!cookies.hasOwnProperty('user')) {
         if (cookies.user.hasOwnProperty('isLoggedIn')) {
            if (!!loggedIn && !cookies.user.isLoggedIn) {
               setCookie('user', { isLoggedIn: true })
            } else {
               setCookie('user', { isLoggedIn: false })
            }
            // !!cookies.user.isLoggedIn ? setLoggedIn(true) : setLoggedIn(false);
         } else {
            setCookie('user', { isLoggedIn: false })
         }
      } else {
         setCookie('user', { isLoggedIn: false })
      }
      // console.log('running:', loggedIn);
      // setUpdate(update + 1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [loggedIn]);

   // useEffect(() => {
   //    runContent();
   // }, [update])

   const runContent = () => {
      // if (!!cookies.hasOwnProperty('user')) {
      //    console.log('in if:', cookies.user)
      // setRun(<div></div>)
      return (
         <Router>
            <NavBar />
            <Switch>
               <Route path="/" exact render={(props) => < LandingPage {...props} />} />
               <Route path="/login" exact render={(props) => {
                  console.log('route login status:', loggedIn)
                  return !!loggedIn ? <Redirect to="/" /> : <LoginPage {...props} />
               }
               } />
               <Route path="/register" exact render={(props) => !!loggedIn ? <Redirect to="/" /> : < RegisterPage {...props} />} />
            </Switch>

            <PrivateRoute path="/ppl/edit_routines" exact ContextProvider={CreateRoutineContextProvider} LoadComponent={EditRoutines} />
            {/* <PrivateRoute path="/ppl/create_routine" exact ContextProvider={CreateRoutineContextProvider} LoadComponent={CreateRoutine} />
               <PrivateRoute path="/profile" exact ContextProvider={RoutineProvider} LoadComponent={ProfilePage} /> */}
         </Router>
      )
      // } else {
      //    console.log('empty')
      //    setCookie('user', { isLoggedIn: false })
      //    return (<div></div>)
      // }
   }

   return (
      <CookiesProvider>
         <UserContext.Provider value={createUserValues}>
            <Router>
               <NavBar />
               <Switch>
                  <Route path="/" exact render={(props) => < LandingPage {...props} />} />
                  <Route path="/login" exact render={(props) => {
                     console.log('route login status:', loggedIn)
                     return !!loggedIn ? <Redirect to="/" /> : <LoginPage {...props} />
                  }
                  } />
                  <Route path="/register" exact render={(props) => !!loggedIn ? <Redirect to="/" /> : < RegisterPage {...props} />} />
               </Switch>

               <PrivateRoute path="/ppl/edit_routines" exact ContextProvider={CreateRoutineContextProvider} LoadComponent={EditRoutines} />
               <PrivateRoute path="/ppl/create_routine" exact ContextProvider={CreateRoutineContextProvider} LoadComponent={CreateRoutine} />
               <PrivateRoute path="/track_progress" exact ContextProvider={CreateRoutineContextProvider} LoadComponent={TrackProgress} />
               <PrivateRoute path="/profile" exact ContextProvider={RoutineProvider} LoadComponent={ProfilePage} />
            </Router>
         </UserContext.Provider>
      </CookiesProvider>
   );
}

export default App;
