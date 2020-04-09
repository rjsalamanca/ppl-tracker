import React, { useState, useEffect, useContext } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

import AddRoutineName from './routine_creation/addRoutineName';
import AddDay from './routine_creation/addDay';

import { CreateRoutineContext } from '../../contexts/CreateRoutineContext';

function EditRoutines() {
   const [routines, setRoutines] = useState([]);
   const [fullRoutine, setFullRoutine] = useState(false)
   const [initialLoad, setInitialLoad] = useState(true);
   const [selectedRoutine, setSelectedRoutine] = useState('Select A Routine');
   const [errorCode, setErrorCode] = useState(-1);
   const [show, setShow] = useState(false);

   const { routineName, setRoutineName, routineDays, setRoutineDays } = useContext(CreateRoutineContext);

   useEffect(() => {
      if (routines.length === 0) checkForRoutines();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [routines]);

   useEffect(() => {
      if (!fullRoutine.routine_found && selectedRoutine !== 'Select A Routine') getFullRoutine();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [fullRoutine, setFullRoutine, selectedRoutine]);

   const getFullRoutine = async () => {
      const url = `http://localhost:3000/ppl/get_full_routine/${selectedRoutine}`;
      try {
         const response = await fetch(url, {
            method: "GET",
            credentials: "include"
         });

         const data = await response.json();

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

   const handleSelect = (e) => {
      //reset values before we reload
      setErrorCode(-1);
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

   const updateRoutine = async () => {
      let sendInfo = {
         routine_id: fullRoutine.routine.routine_id,
         routine_name: routineName,
         days: routineDays
      }

      setErrorCode(-1)

      if (routineName.length < 3) {
         setErrorCode(2)
      } else if (routineDays.length !== 0) {

         const url = "http://localhost:3000/ppl/routine/update_routine";

         ////////////////////////////////////////////////
         //                 ERROR CODES:               //
         ////////////////////////////////////////////////
         // 0: Valid                                   //
         // 1: Update Error                            //
         // 2: Routine Name Must be 3 characters long  //
         // 3: No Days In Routine                      //
         // 4: Backend Connection Failed               //
         ////////////////////////////////////////////////

         try {
            const response = await fetch(url, {
               method: "POST",
               headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
               },
               credentials: 'include',
               body: JSON.stringify(sendInfo)
            });

            const data = await response.json();

            !!data.update_status ? setShow(true) : setErrorCode(1);
         } catch (err) {
            // back end connection error
            setErrorCode(4)
         }
      } else {
         setErrorCode(3)
      }
   }

   const displayErrors = () => {
      let errorMessage = '';

      switch (errorCode) {
         case 1:
            errorMessage = 'There was an error on our end.';
            break;
         case 2:
            errorMessage = 'Your routine name must be atleast 3 characters long.';
            break;
         case 3:
            errorMessage = 'No days in your routine.';
            break;
         case 4:
            errorMessage = 'Hmm, it looks like either our server or your connection is down.';
            break;
         default:
            errorMessage = '';
      }

      return (
         <div className="errorContainer">
            <span className="errorLabel"></span> {errorMessage}
         </div>
      );
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
                  {displayErrors()}
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

   const displayAddDayModal = () => {

      return (
         <Modal show={show} onHide={() => setShow(false)} id="addDayModal">
            <Modal.Header closeButton>
               <Modal.Title>Completed Updating</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               You have successfully updated, you can close this screen to edit more routines or
               click below to either create a new routine or visit youur profile page.
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={(e) => setShow(false)}>Close</Button>
               <Link className="" variant={'danger'} to="/ppl/create_routine">
                  <Button variant="secondary">Create a Routine</Button>
               </Link>
               <Link className="" variant={'danger'} to="/ppl/create_routine">
                  <Button variant="secondary">Profile</Button>
               </Link>
            </Modal.Footer>
         </Modal>
      );
   }

   const displayFullRoutine = () => {

      if (fullRoutine !== false) {
         return (
            <div>
               <AddRoutineName />
               <AddDay />
               <Button className="mb-3" type="submit" variant={'danger'} onClick={() => updateRoutine()}>Update</Button>
               {displayAddDayModal()}

            </div>
         )
      }
   }

   return (
      <div>
         {displayRoutineInformation()}
      </div>
   )
}

export default EditRoutines;