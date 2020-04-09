import React, { useState, useContext, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";

import { useCookies } from 'react-cookie';
import { UserContext } from '../contexts/UserContext';

function PrivateRoute({ ContextProvider, LoadComponent, ...routerProps }) {
   const { loggedIn, setLoggedIn } = useContext(UserContext);
   const [loadRoute, setLoadRoute] = useState();
   const [cookies] = useCookies(['user']);

   useEffect(() => {
      if (!!cookies.hasOwnProperty('user')) {
         !!cookies.user.isLoggedIn ? setLoggedIn(true) : setLoggedIn(false);
      } else {
         setLoggedIn(false);
      }
      checkLoginStatus();

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [cookies, loggedIn])

   const checkLoginStatus = async () => {
      if (!!loggedIn) {
         setLoadRoute(
            <Route {...routerProps} render={(props) =>
               <ContextProvider LoadComponent={LoadComponent} RouterProps={props} />
            } />
         );
      } else {
         setLoadRoute(<Route render={() => <Redirect to='/' />} />)
      }
   }

   return <Switch>{loadRoute}</Switch>;
}

export default PrivateRoute;