import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";

import { useCookies } from 'react-cookie';

function PrivateRoute({ ContextProvider, LoadComponent, ...routerProps }) {
   const [loadRoute, setLoadRoute] = useState();
   const [cookies] = useCookies(['user']);

   useEffect(() => {
      checkLoginStatus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [cookies])

   const checkLoginStatus = async () => {
      if (!!cookies.user.isLoggedIn) {
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