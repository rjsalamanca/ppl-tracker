import React, { useState, useContext, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";

import { UserContext } from './contexts/UserContext';

function PrivateRoute({ ...props }) {
   const { setIsLoggedIn } = useContext(UserContext);
   const [loadRoute, setLoadRoute] = useState();

   useEffect(() => {
      console.log({ ...props })
      checkLoginStatus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const checkLoginStatus = async () => {
      const url = "http://localhost:3000/users/loginStatus";

      try {
         const response = await fetch(url, {
            method: "GET",
            credentials: "include"
         })
         const data = await response.json();
         if (data.is_logged_in) {
            setIsLoggedIn(true);
            setLoadRoute(<Route {...props} />)
         } else {
            if (!props.path === '/' &&
               !props.path === '/login' &&
               !props.path === '/register') {
               setLoadRoute(<Route render={() => <Redirect to='/' />} />)
            } else {
               setLoadRoute(<Route {...props} />)
            }
         }
      } catch (err) {
         setIsLoggedIn(false);
         setLoadRoute(<Route render={() => <Redirect to='/' />} />)
      }
   }

   return <Switch>{loadRoute}</Switch>;
}

export default PrivateRoute;