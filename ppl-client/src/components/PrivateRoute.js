import React, { useState, useContext, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";

// import { useCookies } from 'react-cookie';
import { UserContext } from '../contexts/UserContext';

function PrivateRoute({ ContextProvider, LoadComponent, ...routerProps }) {
   const { loggedIn } = useContext(UserContext);
   const [loadRoute, setLoadRoute] = useState();
   // const [cookies] = useCookies(['user']);

   useEffect(() => {
      console.log('in private route:', loggedIn)
      checkLoginStatus();

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [loggedIn])

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