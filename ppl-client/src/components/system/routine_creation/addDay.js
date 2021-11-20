import React, { useState, useContext } from 'react';
import { Button, Form, Modal } from "react-bootstrap";

import AddExercises from './addExercises';

import { CreateRoutineContext } from '../../../contexts/CreateRoutineContext';

import '../css/addDayStyle.css';

function AddDay() {
   const [show, setShow] = useState(false);
   const [dayName, setDayName] = useState('');
   const [dayError, setDayError] = useState(0);
   const [editing, setEditing] = useState({ idx: null, status: false });

   const { routineDays, setRoutineDays, tempExercises, setTempExercises, setExercises } = useContext(CreateRoutineContext);

   const clearDayError = () => setDayError(0);
   const closeModal = () => {
      console.log('close')
      console.log(tempExercises);

      setTempExercises(tempExercises.map(e => e.deleted = false));
      setShow(false);
      setEditing(false);
   }

   const modalTrigger = () => {
      if (!!show) {
         setShow(false);
      } else {
         setExercises([])
         setShow(true);
         setDayName('');
         setTempExercises([]);
         setDayError(0)
      }
   }

   const addRestDay = () => {
      let tempDays = [...routineDays];
      let currentAmountOfRestDays = tempDays.filter(e => e.name.includes('Rest Day')).length;

      tempDays.push({ name: `Rest Day #${currentAmountOfRestDays + 1}`, newDay: true, rest_day: true, exercises: [{ name: 'No exercises available.' }] });
      setRoutineDays(tempDays);
   }

   const removeDay = (idx) => {
      let tempDays = [...routineDays];
      tempDays.splice(idx, 1);
      setRoutineDays(tempDays);
   }

   const editDay = (idx) => {
      setEditing({ idx, status: true });
      if (!!show) {
         setShow(false);
      } else {
         setShow(true);
         setDayName(routineDays[idx].name);
         setTempExercises(routineDays[idx].exercises);
         setExercises(routineDays[idx].exercises);
         setDayError(0);
      }
   }

   const saveExercisesToDay = async () => {
      let tempDays = [...routineDays];
      if (dayName !== '') {
         if (tempExercises.length !== 0) {
            tempDays.push({ name: dayName, exercises: tempExercises, rest_day: false, newDay: true })
            setRoutineDays(tempDays);
            setDayName('')
            setDayError(0);
            setShow(false)
         } else {
            setDayError(2)
         }
      } else {
         setDayError(1)
      }
   }

   const saveEditDay = () => {
      const tempDays = [...routineDays];
      const countDeleted = tempExercises.map(e => e.hasOwnProperty('deleted')).filter(ed => ed === true).length;
      const countNonDeleted = tempExercises.map(e => e.hasOwnProperty('deleted')).filter(ed => ed === false).length;

      console.log('Edit Day Button:', tempExercises);
      console.log(tempExercises);
      console.log('countDeleted map:', tempExercises.map(e => e.hasOwnProperty('deleted')))

      if (dayName !== '') {

         console.log('temp ex len:', tempExercises.length);
         console.log('deleted len:', countDeleted);
         console.log('not deleted len:', countNonDeleted);

         if (tempExercises.length === countDeleted) {
            console.log('1')
            setDayError(2)
         } else if (tempExercises.length !== countDeleted) {
            console.log('2')
            tempDays[editing.idx] = ({ name: dayName, routine_day_id: routineDays[editing.idx].routine_day_id, routine_id: routineDays[editing.idx].routine_id, exercises: tempExercises, rest_day: routineDays[editing.idx].rest_day, newDay: !!routineDays[editing.idx].hasOwnProperty('newDay') ? true : false });
            setRoutineDays(tempDays);
            setDayName('');
            setExercises([]);
            setDayError(0);
            setEditing(false);
            setShow(false);
         } else {
            console.log('3')
            setDayError(2)
         }
      } else {
         setDayError(1)
      }
   }

   const displayAddDayModal = () => {
      let errorMessage = "";

      ////////////////////////////
      //     ERROR MESSAGES:    //
      ////////////////////////////
      // 0: Pass                //
      // 1: No day name         //
      // 2: No exercises added  //
      ////////////////////////////

      if (dayError === 1) {
         errorMessage = 'Your day must have a name.';
      } else if (dayError === 2) {
         errorMessage = 'Please make sure to add exercises to your routine.';
      }

      return (
         <Modal show={show} onHide={() => closeModal()} id="addDayModal">
            <Modal.Header closeButton>
               <Modal.Title>Add A Day</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form.Group controlId="formBasicEmail">
                  <Form.Label>Day Name: </Form.Label>
                  <Form.Control type="input" onChange={(e) => setDayName(e.target.value)} value={dayName} placeholder="Ex. Push Day, Pull Day, Leg Day" />
               </Form.Group>
               <AddExercises clearDayError={clearDayError} />
               <div className="error-message">
                  <p>{errorMessage}</p>
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={(e) => closeModal(e)}>Close</Button>
               {!!editing.status ?
                  <Button variant="primary" onClick={(e) => saveEditDay(e)}>Edit Day</Button>
                  :
                  <Button variant="primary" onClick={(e) => saveExercisesToDay(e)}>Save Day</Button>
               }
            </Modal.Footer>
         </Modal>
      );
   }

   const displayDays = () => {

      return routineDays.length > 0 && routineDays.map((day, dayIdx) =>
         <div className="singleDayContainer" key={`day-${day.name}-${dayIdx}`}>
            {/* Edit buttton removed when it's a rest day. You can only delete. */}
            {!day.rest_day && <Button className="editDay" variant="secondary" onClick={() => editDay(dayIdx)}>Edit</Button>}
            <Button className="deleteDay" variant="secondary" onClick={() => removeDay(dayIdx)}>X</Button>
            <h4 className="dayName h4">Day {dayIdx + 1} - {day.name}</h4>
            <h6 className="exerciseHeader h6">Exercises:</h6>
            <ol>
               {day.exercises !== null ? day.exercises.map((exercise, idx) =>
                  exercise.deleted === undefined ?
                     <li key={`exercise-${day.name}-${idx}`}>
                        {exercise.name}
                     </li>
                     :
                     !exercise.deleted ?
                        <li key={`exercise-${day.name}-${idx}`}>
                           {exercise.name}
                        </li> : ''

                  // !exercise.hasOwnProperty('deleted') ?
                  //    <li key={`exercise-${day.name}-${idx}`}>
                  //       {exercise.name}
                  //    </li>
                  //    :
                  //    !exercise.deleted ?
                  //       <li key={`exercise-${day.name}-${idx}`}>
                  //          {exercise.name}
                  //       </li> : ''
               ) : 'No Exercises available.'}
            </ol>
         </div>
      )
   }

   return (
      <div>
         {displayAddDayModal()}
         <div className="displayDaysContainer">
            {displayDays()}
         </div>
         <Form>
            <Button className="mb-3 btn-outline-primary" variant="light" onClick={() => modalTrigger()}>Add A Day</Button>
            <Button className="mb-3 ml-3 btn-outline-primary" variant="light" onClick={(e) => addRestDay(e)}>Add A Rest Day</Button>
         </Form>
      </div>
   )
}

export default AddDay;