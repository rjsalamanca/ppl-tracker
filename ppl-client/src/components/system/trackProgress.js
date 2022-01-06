import React, { useState, useContext, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

function TrackProgress() {
   const [routines, setRoutines] = useState([]);
   const [fullRoutine, setFullRoutine] = useState(false)
   const [initialLoad, setInitialLoad] = useState(true);
   const [selectedRoutine, setSelectedRoutine] = useState('Select A Routine');

   useEffect(() => {
      if (routines.length === 0) checkForRoutines();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [routines]);

   useEffect(() => {
      console.log(fullRoutine);
      // console.log(selectedRoutine);
      if (!fullRoutine.routine_found && selectedRoutine !== 'Select A Routine') getFullRoutine();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [fullRoutine, setFullRoutine, selectedRoutine]);


   const handleSelect = (e) => {
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
         setInitialLoad(false);
      } catch (err) {
         console.log(err);
      }
   }

   const getFullRoutine = async () => {
      const url = `http://localhost:3000/ppl/track/${selectedRoutine}`;
      try {
         const response = await fetch(url, {
            method: "GET",
            credentials: "include"
         });

         const data = await response.json();
         console.log('test:', data);
         if (!!data.routine_found) {
            await setFullRoutine(data)
         } else {
            await setFullRoutine({ routine_found: false });
         }
      } catch (err) {
         console.log(err);
      }
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


   return (
      <div>
         {displayRoutineInformation()}
      </div>
   );
}

export default TrackProgress;