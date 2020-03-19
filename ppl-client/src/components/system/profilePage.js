import React, { Component } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
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
      loadRoutineInfo: false
   }

   componentDidMount() {
      this.checkForRoutines();
      // const formatedDate = moment(this.state.date).format("YYYY-MM-DD");
      // this.setState({ date: formatedDate })
   }

   handleRoutine = async (e) => {
      //console.log(e.target.value)
      //if (e.target.value !== 'Select A Routine') {
      await this.setState({
         selectedRoutine: e.target.value,
         loadedRoutine: { routine_found: false },
         selectedWorkout: {},
         loadWorkout: false,
         loadRoutineInfo: true,
      });

      if (this.state.selectedRoutine !== 'Select A Routine') {
         await this.getFullRoutine();
      }
      //     console.log('DONT DO ANYTHING')
      // }
   }

   getFullRoutine = async () => {
      const url = `http://localhost:3000/ppl/get_full_routine/${this.state.selectedRoutine}`;
      try {
         const response = await fetch(url, {
            method: "GET",
            credentials: "include"
         });
         const data = await response.json();
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

   onCalendarOnChange = (date) => {
      this.setState({ date })
   }

   getSelectedWorkout = async (workout) => {
      //Resets
      await this.setState({ selectedWorkout: {}, loadWorkout: false });
      //Sets
      await this.setState({ selectedWorkout: workout, loadWorkout: true });
   }

   loadRoutineComponent = () => {
      const { selectedRoutine, loadRoutineInfo, loadedRoutine } = this.state;
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
         return (<RoutineInformation routine={loadedRoutine} getSelectedWorkout={this.getSelectedWorkout} />)
      }
   }

   loadWorkoutComponent = () => {
      const { loadWorkout, selectedWorkout } = this.state;
      if (!!loadWorkout) {
         return (<WorkoutInformation selectedWorkout={selectedWorkout} />)
      }
      // !!loadWorkout ? <div>SELECTED</div> : ''
   }

   loadTodaysWorkouts = () => {

      try {

      } catch (err) {
         console.log(err);
      }

      return ''
   }

   render() {
      const { routines, date } = this.state;
      return (
         <>
            <div className="routineSelection">
               <Calendar
                  onChange={this.onCalendarOnChange}
                  value={date}
               />
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
                              {routines.length !== 0 ?
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
            </div>
            {this.loadWorkoutComponent()}
            {this.loadTodaysWorkouts()}
         </>
      );
   }
}

export default Profile;