import React, { Component } from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';
// import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";

import './routineInformationStyle.css'

class RoutineInformation extends Component {
   state = {
      loadedProps: false,
      routine_info: {},
      date_between: 0,
      workout_days: {},
      selectedWorkout: {}
   }

   async componentDidMount() {
      await this.setState({
         loadedProps: true,
         routine_info: this.props.routine,
         workout_days: {},
         selectedWorkout: {}
      })
      let start_date = moment(this.state.routine_info.routine.date_started, "MMM-DD-YYYY");
      let current = moment(new Date(), "MMM DD YYYY");
      await this.setState({ date_between: Math.ceil(moment.duration(current.diff(start_date)).asDays()) })
      await this.getTodaysWorkout();
   }
   // componentWillUnmount() {
   //     this.setState({
   //         loadedProps: false,
   //         routine_info: {},
   //         date_between: 0,
   //         workout_days: {},
   //         selectedWorkout: {}
   //     });
   // }

   // async componentWillReceiveProps(newProps) {
   //    const oldProps = this.props;

   //    if (oldProps !== newProps) {
   //       await this.setState({
   //          loadedProps: true,
   //          routine_info: newProps.routine,
   //          workout_days: {},
   //          selectedWorkout: {}
   //       });
   //       if (!!this.state.routine_info.routine_found) {
   //          let start_date = moment(this.state.routine_info.routine.date_started, "MMM-DD-YYYY");
   //          let current = moment(new Date(), "MMM DD YYYY");
   //          await this.setState({ date_between: Math.ceil(moment.duration(current.diff(start_date)).asDays()) })
   //          await this.getTodaysWorkout();
   //       } else {
   //          // await this.setState({
   //          //     workout_days: {},
   //          //     selectedWorkout: {}
   //          // });
   //       }
   //    }
   // }

   getTodaysWorkout = async () => {
      const { routine_info, date_between } = this.state;
      const days = routine_info.routine.routine_days;
      const curr_day_ind = (date_between % days.length) - 1;
      let temp_days = {};
      if (curr_day_ind <= 0) {
         temp_days = { today: days[days.length - 1], tomorrow: days[0] };
         (days.length - 1 === 0) ? temp_days['yesterday'] = days[days.length - 1] : temp_days['yesterday'] = days[days.length - 2]
      } else {
         temp_days = { today: days[curr_day_ind], tomorrow: days[curr_day_ind + 1], yesterday: days[curr_day_ind - 1] };
      }
      await this.setState({ workout_days: temp_days });
   }

   render() {
      const { routine_info, workout_days } = this.state;
      return (
         <>
            {
               // Object.entries(routine_info).length === 0 ?
               //     <div>Loading bruh</div> :
               !!this.state.routine_info.routine_found ?
                  <div>
                     <section id="section-pricing" className="section-pricing">
                        <h2 className="routineName text-center">
                           {routine_info.routine.routine_name}
                        </h2>

                        {!!workout_days.hasOwnProperty('today') ?
                           <div className="container">
                              <div className="pricing-table">
                                 <div className="row center-row">
                                    {/* <!-- First package --> */}
                                    <div className="packageCol">
                                       <div className="package">
                                          <div className="header-package-1 text-center">
                                             <h3>YESTERDAY</h3>
                                          </div>

                                          {/* <!-- details --> */}
                                          <div className="package-features text-center">
                                             Workout: {workout_days.yesterday.day_name}
                                             <ul>
                                                {workout_days.yesterday.exercises.map((exercise, idx) =>
                                                   <li key={`exercise-${workout_days.yesterday.day_name}-${idx}`}>
                                                      {exercise.exercise_name}
                                                   </li>
                                                )}
                                             </ul>
                                             <Button onClick={(e) => this.props.getSelectedWorkout(workout_days.yesterday)}>Start</Button>
                                          </div>
                                       </div>
                                    </div>

                                    {/* <!-- Second package --> */}
                                    <div className="packageCol current">
                                       <div className="package">
                                          <div className="header-package-2 text-center">
                                             <h3>TODAY</h3>
                                          </div>
                                          {/* <!-- details --> */}
                                          <div className="package-features text-center">
                                             Workout: {workout_days.today.day_name}
                                             <ul>
                                                {workout_days.today.exercises.map((exercise, idx) =>
                                                   <li key={`exercise-${workout_days.today.day_name}-${idx}`}>
                                                      {exercise.exercise_name}
                                                   </li>
                                                )}
                                             </ul>
                                             <Button onClick={(e) => this.props.getSelectedWorkout(workout_days.today)}>Start</Button>
                                          </div>
                                       </div>
                                    </div>

                                    {/* <!-- Third package --> */}
                                    <div className="packageCol">
                                       <div className="package">
                                          <div className="header-package-1 text-center">
                                             <h3>TOMORROW</h3>
                                          </div>
                                          {/* <!-- details --> */}
                                          <div className="package-features text-center">
                                             Workout: {workout_days.tomorrow.day_name}
                                             <ul>
                                                {workout_days.tomorrow.exercises.map((exercise, idx) =>
                                                   <li key={`exercise-${workout_days.tomorrow.day_name}-${idx}`}>
                                                      {exercise.exercise_name}
                                                   </li>
                                                )}
                                             </ul>
                                             <Button onClick={(e) => this.props.getSelectedWorkout(workout_days.tomorrow)}>Start</Button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           : ''
                        }
                     </section>
                  </div >
                  : <div>bruh</div>
            }
         </>
      );
   }
}

export default RoutineInformation;