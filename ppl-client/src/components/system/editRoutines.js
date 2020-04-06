import React, { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

import AddRoutineName from './routine_creation/addRoutineName';
import AddDay from './routine_creation/addDay';

import { CreateRoutineContext } from '../../contexts/CreateRoutineContext';

function EditRoutines() {
   const [routines, setRoutines] = useState([]);
   const [fullRoutine, setFullRoutine] = useState(false)
   const [initialLoad, setInitialLoad] = useState(true);
   const [selectedRoutine, setSelectedRoutine] = useState('Select A Routine');

   const { routineName, setRoutineName, setRoutineDays, setExercises } = useContext(CreateRoutineContext);

   useEffect(() => {
      if (routines.length === 0) checkForRoutines();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [routines]);

   useEffect(() => {
      const getFullRoutine = async () => {
         const url = `http://localhost:3000/ppl/get_full_routine/${selectedRoutine}`;
         try {
            const response = await fetch(url, {
               method: "GET",
               credentials: "include"
            });

            const data = await response.json();
            console.log(data)
            if (!!data.routine_found) {
               setRoutineName(data.routine.routine_name);
               setRoutineDays(data.routine.routine_days);
               await setFullRoutine(data)
            } else {
               await setFullRoutine({ routine_found: false });
            }

         } catch (err) {
            console.log(err);
         }
      }

      if (!fullRoutine.routine_found && selectedRoutine !== 'Select A Routine') {
         getFullRoutine();
      }
   }, [fullRoutine, setFullRoutine, selectedRoutine]);

   const handleSelect = (e) => {
      //reset values before we reload
      setRoutineName('');
      setRoutineDays([]);
      setFullRoutine({})
      setSelectedRoutine(e.target.value);
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
         setInitialLoad(false)
      } catch (err) {
         console.log(err);
      }
   }

   const updateRoutine = () => {
      console.log('updating!')
   }


   const displayRoutineInformation = () => {
      if (!initialLoad) {
         if (routines.length !== 0) {
            return (
               <div className="routineInformation">
                  <Form>
                     <Form.Control onChange={e => handleSelect(e)} as="select" defaultValue={selectedRoutine}>
                        <option value="Select A Routine">Select A Routine</option>
                        {routines.map(routine =>
                           <option key={`routine${routine.id}`} value={routine.routine_name}>{routine.routine_name}</option>
                        )}
                     </Form.Control>
                  </Form>
                  {displayFullRoutine()}
               </div>
            );
         } else {
            return (
               <div>
                  <p>No Routines Found</p>
                  <Link className="" variant={'danger'} to="/ppl/create_routine">
                     <Button className="mb-3" type="submit" variant={'danger'} >Create A routine</Button>
                  </Link>
               </div>
            );
         }
      } else {
         return <div></div>
      }
   }

   const displayFullRoutine = () => {

      if (fullRoutine !== false) {
         return (
            <div>
               <AddRoutineName />
               <AddDay />
               <Button className="mb-3" type="submit" variant={'danger'} onClick={() => updateRoutine()}>Update</Button>
            </div>
         );
      }
   }

   return (
      <div>
         {displayRoutineInformation()}
      </div>
   )
}

export default EditRoutines;