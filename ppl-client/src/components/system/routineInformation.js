import React, { Component } from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';
// import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";

import './css/routineInformationStyle.css'

class RoutineInformation extends Component {
   state = {
      loadedProps: false,
      routine_info: {},
      date_between: 0,
      workout_days: {},
      selectedWorkout: {},
      date: ''
   }

   static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.calendar_date !== prevState.date) {
         return { date: nextProps.calendar_date };
      } else return null;
   }

   async componentDidUpdate(prevProps, prevState) {
      if (prevProps.calendar_date !== this.props.calendar_date) {
         await this.setState({
            loadedProps: true,
            routine_info: this.props.routine,
            workout_days: {},
            selectedWorkout: {}
         });

         if (!!this.state.routine_info.routine_found) {
            let start_date = moment(this.state.routine_info.routine.date_started);
            let current = moment(this.state.date, "YYYY-MM-DD")

            await this.setState({ date_between: Math.floor(moment.duration(current.diff(start_date)).asDays()) })
            await this.getTodaysWorkout();
         }
      }
   }

   async componentDidMount() {
      await this.setState({
         loadedProps: true,
         routine_info: this.props.routine,
         workout_days: {},
         selectedWorkout: {},
         date: this.props.calendar_date
      });
      let start_date = moment(this.state.routine_info.routine.date_started);
      let current = moment(this.state.date, "YYYY-MM-DD");

      await this.setState({ date_between: Math.floor(moment.duration(current.diff(start_date)).asDays()) })
      await this.getTodaysWorkout();
   }

   getTodaysWorkout = async () => {
      const { routine_info, date_between } = this.state;
      const days = routine_info.routine.routine_days;
      const curr_day_ind = date_between % days.length;
      let temp_days = {};

      if (curr_day_ind === 0) {
         // cycle at the start
         // console.log('cycle in start');
         temp_days = { yesterday: days[days.length - 1], today: days[curr_day_ind] };
         (days.length - 1 === 0) ? temp_days['tomorrow'] = days[0] : temp_days['tomorrow'] = days[curr_day_ind + 1]
      } else if (curr_day_ind === days.length - 1) {
         //cycle at the end
         // console.log('cycle in end');
         temp_days = { yesterday: days[curr_day_ind - 1], today: days[curr_day_ind], tomorrow: days[0] };
      } else {
         // cycle in between
         // console.log('cycle in between');
         temp_days = { yesterday: days[curr_day_ind - 1], today: days[curr_day_ind], tomorrow: days[curr_day_ind + 1] };
      }

      if (date_between <= 0) temp_days.yesterday = null;
      if (date_between <= -1) temp_days.today = null;
      if (date_between <= -2) temp_days.tomorrow = null;

      await this.setState({ workout_days: temp_days });
   }

   displayWorkoutDays = (day) => {
      const { workout_days } = this.state;

      return (
         <div className="packageCol">
            <div className="package">
               <div className="header-package-1 text-center">
                  <h3>{day.toUpperCase()}</h3>
               </div>
               <div className="package-features text-center">
                  {
                     workout_days[day] !== null ?
                        <div>
                           Workout: {workout_days[day].day_name}
                           {
                              workout_days[day].day_name === "Rest Day" ?
                                 <p className="m-3">
                                    <b>Sit back and relax, on your rest day.</b>
                                 </p>
                                 :
                                 <div>
                                    <ul>
                                       {workout_days[day].exercises.map((exercise, idx) =>
                                          <li key={`exercise-${workout_days[day].day_name}-${idx}`}>
                                             {exercise.exercise_name}
                                          </li>
                                       )}
                                    </ul>
                                    <Button onClick={(e) => this.props.getSelectedWorkout(workout_days[day])}>Start</Button>
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

   displayRoutineDays = () => {
      const { routine_info, workout_days } = this.state;
      let routineDisplayContainer = '';
      let routineDisplayWorkoutsAvaiable = '';

      if (!!this.state.routine_info.routine_found) {
         if (!!workout_days.hasOwnProperty('today')) {
            routineDisplayWorkoutsAvaiable = (
               <div className="container">
                  <div className="pricing-table">
                     <div className="row center-row">
                        {this.displayWorkoutDays('yesterday')}
                        {this.displayWorkoutDays('today')}
                        {this.displayWorkoutDays('tomorrow')}
                     </div>
                  </div>
               </div>
            );
         }

         routineDisplayContainer = (
            <div>
               <section id="section-pricing" className="section-pricing">
                  <h2 className="routineName text-center">
                     {routine_info.routine.routine_name}
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

   render() {
      return (
         <div>
            {this.displayRoutineDays()}
         </div>
      );
   }
}

export default RoutineInformation;