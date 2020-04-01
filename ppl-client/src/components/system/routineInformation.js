import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';
// import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";


//BEING PASSED AS PROPS
// return (<RoutineInformation calendar_date={date} routine={loadedRoutine} getSelectedWorkout={getSelectedWorkout} />)


import { UserContext } from '../../UserContext';

import './css/routineInformationStyle.css'

function RoutineInformation(props) {
   // const [loadedProps, setLoadedProps] = useState(false);
   // const [routineInfo, setRoutineInfo] = useState({});
   const [dateBetween, setDateBetween] = useState(null);
   const [workoutDays, setWorkoutDays] = useState({});
   // const [date, setDate] = useState('');

   const { selectedWorkout, setSelectedWorkout, date, fullRoutine } = useContext(UserContext);

   // state = {
   //    loadedProps: false,
   //    routineInfo: {},
   //    dateBetween: 0,
   //    workoutDays: {},
   //    selectedWorkout: {},
   //    date: ''
   // }

   // static getDerivedStateFromProps(nextProps, prevState) {
   //    if (nextProps.calendar_date !== prevState.date) {
   //       return { date: nextProps.calendar_date };
   //    } else return null;
   // }

   // async componentDidUpdate(prevProps, prevState) {
   //    if (prevProps.calendar_date !== this.props.calendar_date) {
   //       await this.setState({
   //          loadedProps: true,
   //          routineInfo: this.props.routine,
   //          workoutDays: {},
   //          selectedWorkout: {}
   //       });

   //       if (!!this.state.routineInfo.routine_found) {
   //          let start_date = moment(this.state.routineInfo.routine.date_started);
   //          let current = moment(this.state.date, "YYYY-MM-DD")

   //          await this.setState({ dateBetween: Math.floor(moment.duration(current.diff(start_date)).asDays()) })
   //          await this.getTodaysWorkout();
   //       }
   //    }
   // }



   // async componentDidMount() {
   //    await this.setState({
   //       loadedProps: true,
   //       routineInfo: this.props.routine,
   //       workoutDays: {},
   //       selectedWorkout: {},
   //       date: this.props.calendar_date
   //    });
   //    let start_date = moment(this.state.routineInfo.routine.date_started);
   //    let current = moment(this.state.date, "YYYY-MM-DD");

   //    await this.setState({ dateBetween: Math.floor(moment.duration(current.diff(start_date)).asDays()) })
   //    await this.getTodaysWorkout();
   // }


   useEffect(() => {
      // await this.setState({
      //    loadedProps: true,
      //    routineInfo: this.props.routine,
      //    workoutDays: {},
      //    selectedWorkout: {},
      //    date: this.props.calendar_date
      // });
      // setRoutineInfo(props.routine)
      setWorkoutDays({})
      // setDate(props.calendar_date)

      let start_date = moment(fullRoutine.routine.date_started);
      let current = moment(date, "YYYY-MM-DD");
      setDateBetween(Math.floor(moment.duration(current.diff(start_date)).asDays()));
      // await this.setState({ dateBetween: Math.floor(moment.duration(current.diff(start_date)).asDays()) })
      // getTodaysWorkout();
      if (!isNaN(dateBetween)) {
         console.log(dateBetween)
         getTodaysWorkout();
      }

   }, [dateBetween])

   const getTodaysWorkout = () => {
      // const { routineInfo, dateBetween } = this.state;
      const days = fullRoutine.routine.routine_days;
      const currDayInd = dateBetween % days.length;
      let temp_days = {};

      console.log('days:', days)
      console.log(dateBetween)
      if (currDayInd === 0) {
         // cycle at the start
         // console.log('cycle in start');
         temp_days = { yesterday: days[days.length - 1], today: days[currDayInd] };
         (days.length - 1 === 0) ? temp_days['tomorrow'] = days[0] : temp_days['tomorrow'] = days[currDayInd + 1]
      } else if (currDayInd === days.length - 1) {
         //cycle at the end
         // console.log('cycle in end');
         temp_days = { yesterday: days[currDayInd - 1], today: days[currDayInd], tomorrow: days[0] };
      } else {
         // cycle in between
         // console.log('cycle in between');
         temp_days = { yesterday: days[currDayInd - 1], today: days[currDayInd], tomorrow: days[currDayInd + 1] };
      }

      if (dateBetween <= 0) temp_days.yesterday = null;
      if (dateBetween <= -1) temp_days.today = null;
      if (dateBetween <= -2) temp_days.tomorrow = null;
      console.log(temp_days)
      setWorkoutDays(temp_days);
   }

   const displayWorkoutDays = (day) => {
      // const { workoutDays } = this.state;

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
                           Workout: {workoutDays[day].day_name}
                           {
                              workoutDays[day].day_name === "Rest Day" ?
                                 <p className="m-3">
                                    <b>Sit back and relax, on your rest day.</b>
                                 </p>
                                 :
                                 <div>
                                    <ul>
                                       {workoutDays[day].exercises.map((exercise, idx) =>
                                          <li key={`exercise-${workoutDays[day].day_name}-${idx}`}>
                                             {exercise.exercise_name}
                                          </li>
                                       )}
                                    </ul>
                                    <Button onClick={(e) => props.getSelectedWorkout(workoutDays[day])}>Start</Button>
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
      // const { routineInfo, workoutDays } = this.state;
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

   // render() {
   return (
      <div>
         {displayRoutineDays()}
      </div>
   );
   // }
}

export default RoutineInformation;