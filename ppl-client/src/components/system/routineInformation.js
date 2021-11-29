import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';

import { RoutineContext } from '../../contexts/RoutineContext';

import './css/routineInformationStyle.css'

function RoutineInformation() {
   const [dateBetween, setDateBetween] = useState(null);
   const [workoutDays, setWorkoutDays] = useState({});

   const { setSelectedWorkout, date, fullRoutine } = useContext(RoutineContext);

   useEffect(() => {
      let start_date = moment(fullRoutine.routine.date_started);
      let current = moment(date, "YYYY-MM-DD");

      setDateBetween(Math.floor(moment.duration(current.diff(start_date)).asDays()));

      if (!workoutDays.hasOwnProperty('today')) getTodaysWorkout();

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [date, fullRoutine, workoutDays]);


   useEffect(() => {
      let start_date = moment(fullRoutine.routine.date_started);
      let current = moment(date, "YYYY-MM-DD");
      setWorkoutDays({});

      if (dateBetween === null) {
         setDateBetween(Math.floor(moment.duration(current.diff(start_date)).asDays()));
         getTodaysWorkout();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [date, dateBetween, fullRoutine]);

   const getTodaysWorkout = () => {
      const days = fullRoutine.routine.routine_days;
      const currDayInd = dateBetween % days.length;
      let temp_days = {};
      if (currDayInd === 0) {
         // cycle at the start
         temp_days = { yesterday: days[days.length - 1], today: days[currDayInd] };
         (days.length - 1 === 0) ? temp_days['tomorrow'] = days[0] : temp_days['tomorrow'] = days[currDayInd + 1]
      } else if (currDayInd === days.length - 1) {
         //cycle at the end
         temp_days = { yesterday: days[currDayInd - 1], today: days[currDayInd], tomorrow: days[0] };
      } else {
         // cycle in between
         temp_days = { yesterday: days[currDayInd - 1], today: days[currDayInd], tomorrow: days[currDayInd + 1] };
      }

      if (dateBetween <= 0) temp_days.yesterday = null;
      if (dateBetween <= -1) temp_days.today = null;
      if (dateBetween <= -2) temp_days.tomorrow = null;

      setWorkoutDays(temp_days);
   }


   const getSelectedWorkout = (workout) => {
      //Resets
      setSelectedWorkout({});

      //Sets
      setSelectedWorkout(workout)
   }

   const displayWorkoutDays = (day) => {
      return (
         <div className="packageCol">
            <div className="package">
               <div className="header-package-1 text-center">
                  <h3>{day.toUpperCase()}</h3>
               </div>
               <div className="package-features text-center">
                  {
                     workoutDays[day] !== null ?
                        <div>
                           Workout: {workoutDays[day].name}
                           {
                              workoutDays[day].name.includes("Rest Day #") ?
                                 <p className="m-3">
                                    <b>Sit back and relax, on your rest day.</b>
                                 </p>
                                 :
                                 <div>
                                    <ul>
                                       {console.log(workoutDays[day].exercises)}
                                       {/* {workoutDays[day].exercises.map((exercise, idx) =>
                                          <li key={`exercise-${workoutDays[day].name}-${idx}`}>
                                             {exercise.name}
                                          </li>
                                       )} */}
                                    </ul>
                                    <Button onClick={(e) => getSelectedWorkout(workoutDays[day])}>Start</Button>
                                 </div>
                           }
                        </div>
                        :
                        <b>WORKOUT NOT AVAILABLE BEFORE THIS DATE</b>
                  }
               </div>
            </div>
         </div>
      );
   }

   const displayRoutineDays = () => {
      let routineDisplayContainer = '';
      let routineDisplayWorkoutsAvaiable = '';

      if (!!fullRoutine.routine_found) {
         if (!!workoutDays.hasOwnProperty('today')) {
            routineDisplayWorkoutsAvaiable = (
               <div className="container">
                  <div className="pricing-table">
                     <div className="row center-row">
                        {displayWorkoutDays('yesterday')}
                        {displayWorkoutDays('today')}
                        {displayWorkoutDays('tomorrow')}
                     </div>
                  </div>
               </div>
            );
         }

         routineDisplayContainer = (
            <div>
               <section id="section-pricing" className="section-pricing">
                  <h2 className="routineName text-center">
                     {fullRoutine.routine.routine_name}
                  </h2>
                  {routineDisplayWorkoutsAvaiable}
               </section>
            </div >
         );
      } else {
         routineDisplayContainer = '';
      }

      return routineDisplayContainer;
   }

   return (
      <div>
         {console.log(fullRoutine.routine)}
         {displayRoutineDays()}
      </div>
   );
}

export default RoutineInformation;