import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { useCookies } from 'react-cookie';


function TrackTest() {
   const location = useLocation();
   const [day, setDay] = useState({});
   const [cookies, setCookie] = useCookies(['user']);


   useEffect(() => {
      // if page refresh, we need to get day information fr
      if (!location.hasOwnProperty('day')) getDay();
   }, [])

   console.log(cookies);

   const getDay = () => {
      console.log('test this')
   }

   return (
      <div>test</div>
   )
}

export default TrackTest;