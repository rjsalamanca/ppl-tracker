import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

import RoutineInformation from './routineInformation';
import WorkoutInformation from './workoutInformation';

import './css/profilePageStyle.css'

function Profile() {
   const [date, setDate] = useState(new Date());
   const [routines, setRoutines] = useState([]);
   const [selectedRoutine, setSelectedRoutine] = useState('Select A Routine');
   const [selectedWorkout, setSelectedWorkout] = useState({});
   const [todaysWorkouts, setTodaysWorkouts] = useState({});
   const [loadedRoutine, setLoadedRoutine] = useState({ routine_found: false });
   const [loadWorkout, setLoadWorkout] = useState(false);
   const [loadRoutineInfo, setLoadRoutineInfo] = useState(true);
   // state = {
   //    date: new Date(),
   //    routines: [],
   //    selectedRoutine: 'Select A Routine',
   //    loadedRoutine: { routine_found: false },
   //    selectedWorkout: {},
   //    loadWorkout: false,
   //    todaysWorkouts: []
   // }

   // componentDidMount() {
   //    checkForRoutines();
   //    loadTodaysWorkouts();
   // }

   useEffect(() => {
      if (routines.length === 0 && !todaysWorkouts.hasOwnProperty('todays_workout')) {
         checkForRoutines();
         loadTodaysWorkouts();
      }
   }, []);

   useEffect(() => {
      if (selectedRoutine !== 'Select A Routine') getFullRoutine();
   }, [selectedRoutine]);

   const handleRoutine = (e) => {
      setSelectedRoutine(e.target.value);
      setLoadedRoutine({ routine_found: false });
      setSelectedWorkout({});
      setLoadWorkout(false);
      setLoadRoutineInfo(true)
      // await setState({
      //    selectedRoutine: e.target.value,
      //    loadedRoutine: { routine_found: false },
      //    selectedWorkout: {},
      //    loadWorkout: false,
      //    loadRoutineInfo: true
      // });
      // console.log(e.target.value)
      // if
      // // console.log(e.target.value)
      // if (selectedRoutine !== 'Select A Routine') getFullRoutine();
   }

   const getFullRoutine = async () => {
      console.log(selectedRoutine)
      const url = `http://localhost:3000/ppl/get_full_routine/${selectedRoutine}`;
      try {
         const response = await fetch(url, {
            method: "GET",
            credentials: "include"
         });


         const data = await response.json();

         console.log('this is loaded info: ', data)
         if (!!data.routine_found) {
            await setLoadedRoutine(data)
         } else {
            await setLoadedRoutine({ routine_found: false });
         }

         setLoadRoutineInfo(false);

         // !!data.routine_found ? setState({ loadedRoutine: data, loadRoutineInfo: false }) : setState({ loadedRoutine: { routine_found: false }, loadRoutineInfo: false });
      } catch (err) {
         console.log(err);
      }
   }

   const checkForRoutines = async () => {
      const url = "http://localhost:3000/ppl/routine";

      try {
         const response = await fetch(url, {
            method: "GET",
            credentials: "include"
         });

         const data = await response.json();

         if (data.routine_found === true) setRoutines(data.routines);
      } catch (err) {
         console.log(err);
      }
   }

   const onCalendarOnChange = async (date) => {
      await setDate(date);
      loadTodaysWorkouts();
   }

   const getSelectedWorkout = async (workout) => {
      //Resets
      // await setState({ selectedWorkout: {}, loadWorkout: false });
      await setSelectedWorkout({});
      await setLoadWorkout(false);

      //Sets
      // await setState({ selectedWorkout: workout, loadWorkout: true });
      await setSelectedWorkout(workout)
      await loadWorkout(true);
   }

   const loadRoutineComponent = () => {
      // const { selectedRoutine, loadRoutineInfo, loadedRoutine, date } = state;
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
         return (<RoutineInformation calendar_date={date} routine={loadedRoutine} getSelectedWorkout={getSelectedWorkout} />)
      }
   }

   const loadWorkoutComponent = () => {
      // const { loadWorkout, selectedWorkout } = state;
      if (!!loadWorkout) {
         return (<WorkoutInformation selectedWorkout={selectedWorkout} />)
      }
   }

   const loadTodaysWorkouts = async () => {
      const url = 'http://localhost:3000/ppl/routine/currentDay';
      try {
         const response = await fetch(url, {
            method: "POST",
            headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ date })
         });
         let data = await response.json();
         // await setState({ todaysWorkouts: data.todays_workout })
         await setTodaysWorkouts(data.todays_workout);
      } catch (err) {
         console.log(err);
      }
   }

   // render() {
   // const { routines, date, todaysWorkouts } = state;
   return (
      <div className="routineContainer">
         <div className="routineDateInfo">
            <Calendar
               onChange={onCalendarOnChange}
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
                        <Form.Control onChange={e => { handleRoutine(e) }} as="select" defaultValue={selectedRoutine}>
                           <option value="Select A Routine">Select A Routine</option>
                           {
                              routines.length !== 0 ?
                                 routines.map(routine =>
                                    <option key={`routine${routine.id}`} value={routine.routine_name}>{routine.routine_name}</option>
                                 )
                                 :
                                 <option disabled>Loading Routines...</option>
                           }
                        </Form.Control>
                     </Form>
                     {loadRoutineComponent()}
                  </div>
            }
            {loadWorkoutComponent()}
         </div>
      </div>
   );
   // }
}

export default Profile;