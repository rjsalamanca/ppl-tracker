import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import { useCookies } from 'react-cookie';

function TrackTest() {
   const location = useLocation();
   const [day, setDay] = useState({});
   const [cookies] = useCookies(['user']);
   const [redirectPage, setRedirectPage] = useState(false);

   useEffect(() => {
      // if page refresh, we need to get day information fr
      if (!cookies.hasOwnProperty('routine')) {
         getDay();
      } else {
         try {
            const routine = parseInt(location.search.match(/routine_(\d+)/i)[1]);
            const routine_day = parseInt(location.search.match(/day_(\d+)/i)[1]);
            const fullRoutine = cookies.routine;

            setDay(fullRoutine.routine_days.filter(day => (day.routine_id === routine) && (day.routine_day_id === routine_day))[0])
         } catch (e) {
            console.log(e)
            setRedirectPage(true);
         }
      }
   }, [])

   // console.log(cookies);

   const getDay = () => {
      console.log('Need to call api to get info')
   }
   console.log(day)

   return (

      < div >
         {
            !!redirectPage ? <Redirect to="/" /> :
               <div>
                  {'hello' + day.name}
               </div>
         }
      </div >
   )
}

export default TrackTest;