import React, { Component } from 'react';
import Calendar from 'react-calendar';
import { Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

import RoutineInformation from './routineInformation';
import WorkoutInformation from './workoutInformation';

import './css/profilePageStyle.css'

class Profile extends Component {
   state = {
      date: new Date(),
      routines: [],
      selectedRoutine: 'Select A Routine',
      loadedRoutine: { routine_found: false },
      selectedWorkout: {},
      loadWorkout: false,
      todaysWorkouts: []
   }

   componentDidMount() {
      this.checkForRoutines();
      this.loadTodaysWorkouts();
   }

   handleRoutine = async (e) => {
      await this.setState({
         selectedRoutine: e.target.value,
         loadedRoutine: { routine_found: false },
         selectedWorkout: {},
         loadWorkout: false,
         loadRoutineInfo: true
      });

      if (this.state.selectedRoutine !== 'Select A Routine') {
         await this.getFullRoutine();
      }
   }

   getFullRoutine = async () => {
      const url = `http://localhost:3000/ppl/get_full_routine/${this.state.selectedRoutine}`;
      try {
         const response = await fetch(url, {
            method: "GET",
            credentials: "include"
         });
         const data = await response.json();
         console.log('this is loaded info: ', data)
         !!data.routine_found ? this.setState({ loadedRoutine: data, loadRoutineInfo: false }) : this.setState({ loadedRoutine: { routine_found: false }, loadRoutineInfo: false });
      } catch (err) {
         console.log(err);
      }
   }

   checkForRoutines = async () => {
      const url = "http://localhost:3000/ppl/routine";

      try {
         const response = await fetch(url, {
            method: "GET",
            credentials: "include"
         });

         const data = await response.json();
         if (data.routine_found === true) this.setState({ routines: data.routines });
      } catch (err) {
         console.log(err);
      }
   }

   onCalendarOnChange = async (date) => {
      await this.setState({ date });
      this.loadTodaysWorkouts();
   }

   getSelectedWorkout = async (workout) => {
      //Resets
      await this.setState({ selectedWorkout: {}, loadWorkout: false });
      //Sets
      await this.setState({ selectedWorkout: workout, loadWorkout: true });
   }

   loadRoutineComponent = () => {
      const { selectedRoutine, loadRoutineInfo, loadedRoutine, date } = this.state;
      if (selectedRoutine === 'Select A Routine') {
         return (<div>Please select a routine above.</div>);
      } else if (!!loadRoutineInfo) {
         return (
            <div>
               {
                  //LOADING IN HERE
               }
            </div>
         );
      } else if (!loadedRoutine.routine_found) {
         return (<div>NO INFO FOUND</div>);
      } else {
         return (<RoutineInformation calendar_date={date} routine={loadedRoutine} getSelectedWorkout={this.getSelectedWorkout} />)
      }
   }

   loadWorkoutComponent = () => {
      const { loadWorkout, selectedWorkout } = this.state;
      if (!!loadWorkout) {
         return (<WorkoutInformation selectedWorkout={selectedWorkout} />)
      }
   }

   loadTodaysWorkouts = async () => {
      const url = 'http://localhost:3000/ppl/routine/currentDay';
      try {
         const response = await fetch(url, {
            method: "POST",
            headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ date: this.state.date })
         });
         let data = await response.json();
         await this.setState({ todaysWorkouts: data.todays_workout })
      } catch (err) {
         console.log(err);
      }
   }

   render() {
      const { routines, date, todaysWorkouts } = this.state;
      return (
         <div className="routineContainer">
            <div className="routineDateInfo">
               <Calendar
                  onChange={this.onCalendarOnChange}
                  value={date}
               />
               {
                  todaysWorkouts.length > 0 &&
                  <div>
                     <h3 className="h5">Workouts Scheduled for Today:</h3>
                     <ul className="list-group">
                        {
                           todaysWorkouts.map((workout, ind) =>
                              <li key={`todays_workout_${workout.routine_name}_${ind}`} className="list-group-item">
                                 {workout.routine_name}
                                 <ul className="list-group">
                                    <li className="list-group-item">{workout.current_workout.day_name}</li>
                                 </ul>
                              </li>
                           )
                        }
                     </ul>
                  </div>
               }
            </div>
            <div className="routineSelection">
               {
                  routines.length === 0 ?
                     <div>
                        No Routine Found
                           <Link className="nav-link" to="/ppl/create_routine">
                           <Button className="mb-3" type="submit" variant={'danger'} >Create A routine</Button>
                        </Link>
                     </div>
                     :
                     <div className="routineInformation">
                        <Form>
                           <Form.Control onChange={(e) => this.handleRoutine(e)} as="select">
                              <option>Select A Routine</option>
                              {
                                 routines.length !== 0 ?
                                    routines.map(routine =>
                                       <option key={`routine${routine.id}`}>{routine.routine_name}</option>
                                    )
                                    :
                                    <option disabled>Loading Routines...</option>
                              }
                           </Form.Control>
                        </Form>
                        {this.loadRoutineComponent()}
                     </div>
               }
               {this.loadWorkoutComponent()}
            </div>
         </div>
      );
   }
}

export default Profile;