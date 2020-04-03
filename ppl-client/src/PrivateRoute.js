import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
// import { Switch, Route, Redirect } from 'react-router-dom';

import { UserContext } from './contexts/UserContext';

function PrivateRoute({ ...props }) {
   const { setIsLoggedIn } = useContext(UserContext);
   const [loadRoute, setLoadRoute] = useState();

   useEffect(() => {
      checkLoginStatus();
   }, [])

   const checkLoginStatus = async () => {
      const url = "http://localhost:3000/users/loginStatus";
      // console.log({ ...props })
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