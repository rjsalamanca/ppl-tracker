import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";

import { useCookies } from 'react-cookie';

function PrivateRoute({ ContextProvider, Component, ...routerProps }) {
   const [loadRoute, setLoadRoute] = useState();
   const [cookies, setCookie] = useCookies(['user']);
   // const Provider = provider;
   // const LoadComponent = component;
   useEffect(() => {
      checkLoginStatus();
      // console.log({ ...routerProps })
   }, [])

   const checkLoginStatus = async () => {
      if (!!cookies.user.isLoggedIn) {
         // await contextValues.setRoutineName('in Private')
         // console.log(contextValues.routineName);
         // <PrivateRoute path="/ppl/create_routine" exact render={(props) =>
         //    <CreateRoutineContext.Provider value={createRoutineValues}>
         //       <CreateRoutine {...props} />
         //    </CreateRoutineContext.Provider>
         // } />
         setLoadRoute(<Route {...routerProps} render={(props) =>
            <ContextProvider LoadComponent={Component} RouterProps={props} />

         } />
         );
      } else {
         setLoadRoute(<Route render={() => <Redirect to='/' />} />)
      }
   }

   return <Switch>{loadRoute}</Switch>;
}

export default PrivateRoute;