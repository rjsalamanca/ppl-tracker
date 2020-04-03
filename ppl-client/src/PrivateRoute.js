import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { UserContext } from './contexts/UserContext';

function PrivateRoute({ ...props }) {
   const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

   const checkLoginStatus = async () => {
      const url = "http://localhost:3000/users/loginStatus";

      try {
         const response = await fetch(url, {
            method: "GET",
            credentials: "include"
         })
         const data = await response.json();
         console.log(data)
         if (data.is_logged_in) {
            console.log('yo')
            setIsLoggedIn(true);
            //return <Route {...props} />
            return <Redirect to='/login' />
         } else {
            return <Redirect to='/' />
         }
      } catch (err) {
         console.log(false)

         setIsLoggedIn(false);
         return <Redirect to='/' />
      }
   }

   return
   <div>
      {checkLoginStatus()}
   </div>;
}

export default PrivateRoute;