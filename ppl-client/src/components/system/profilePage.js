import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import { Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

import RoutineInformation from './routineInformation';
import WorkoutInformation from './workoutInformation';

import { RoutineContext } from '../../contexts/RoutineContext';

import './css/profilePageStyle.css'

function Profile() {
   const [routines, setRoutines] = useState([]);
   const [selectedRoutine, setSelectedRoutine] = useState('Select A Routine');
   const [todaysWorkouts, setTodaysWorkouts] = useState({});
   const [loadRoutineInfo, setLoadRoutineInfo] = useState(true);

   const { selectedWorkout, setSelectedWorkout, date, setDate, fullRoutine, setFullRoutine } = useContext(RoutineContext);

   useEffect(() => {
      loadTodaysWorkouts();

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [date])

   useEffect(() => {
      if (routines.length === 0 && !todaysWorkouts.hasOwnProperty('todays_workout')) {
         checkForRoutines();
         loadTodaysWorkouts();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [routines, todaysWorkouts]);

   useEffect(() => {
      const getFullRoutine = async () => {
         const url = `http://localhost:3000/ppl/get_full_routine/${selectedRoutine}`;
         try {
            const response = await fetch(url, {
               method: "GET",
               credentials: "include"
            });

            const data = await response.json();
            if (!!data.routine_found) {
               await setFullRoutine(data)
            } else {
               await setFullRoutine({ routine_found: false });
            }

            setLoadRoutineInfo(false);
         } catch (err) {
            console.log(err);
         }
      }

      if (!fullRoutine.routine_found && selectedRoutine !== 'Select A Routine') {
         getFullRoutine();
      }
   }, [fullRoutine, setFullRoutine, selectedRoutine]);

   const handleRoutine = (e) => {
      setSelectedRoutine(e.target.value);
      setFullRoutine({ routine_found: false });
      setSelectedWorkout({});
      setLoadRoutineInfo(true)
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

   const loadRoutineComponent = () => {
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
      } else if (!fullRoutine.routine_found) {
         return (<div>NO INFO FOUND</div>);
      } else {
         return (<RoutineInformation />)
      }
   }

   const loadWorkoutComponent = () => {
      if (selectedWorkout.hasOwnProperty('name')) {
         return (<WorkoutInformation />)
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
         await setTodaysWorkouts(data.todays_workout);
      } catch (err) {
         console.log(err);
      }
   }

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
                                 <li className="list-group-item">{workout.current_workout.name}</li>
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
}

export default Profile;