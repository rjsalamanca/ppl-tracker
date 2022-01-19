import React, { useState, useContext, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";

import { useCookies } from 'react-cookie';
import { UserContext } from '../contexts/UserContext';

function PrivateRoute({ ContextProvider, LoadComponent, ...routerProps }) {
   const [loadRoute, setLoadRoute] = useState();
   const [cookies] = useCookies(['user']);
   const { loggedIn, setLoggedIn } = useContext(UserContext);

   useEffect(() => {
      if (!!cookies.hasOwnProperty('user')) {
         if (!!loggedIn && !!cookies.user.isLoggedIn) {
            setLoggedIn(true);
         }
      } else {
         setLoggedIn(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [cookies])

   useEffect(() => {
      if (!!cookies.hasOwnProperty('user')) {
         if (!!loggedIn && !!cookies.user.isLoggedIn) {
            checkLoginStatus();
         } else if (!cookies.user.isLoggedIn) {
            setLoadRoute(<Route render={() => <Redirect to='/' />} />)
         }
      }
   }, [cookies, loggedIn])

   const checkLoginStatus = async () => {
      await setLoadRoute(
         <Route {...routerProps} render={(props) =>
            <ContextProvider LoadComponent={LoadComponent} RouterProps={props} />
         } />
      );
   }

   return <Switch>{loadRoute}</Switch>;
}

export default PrivateRoute;