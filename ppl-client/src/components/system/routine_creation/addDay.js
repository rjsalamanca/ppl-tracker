import React, { useState, useContext } from 'react';
import { Button, Form, Modal } from "react-bootstrap";

import AddExercises from './addExercises';

import { CreateRoutineContext } from '../../../contexts/CreateRoutineContext';

import '../css/addDayStyle.css';

function AddDay() {
   const [show, setShow] = useState(false);
   const [dayName, setDayName] = useState('');
   const [dayError, setDayError] = useState(0);

   const { routineDays, setRoutineDays, tempExercises, setTempExercises } = useContext(CreateRoutineContext);

   const clearDayError = () => setDayError(0);

   const modalTrigger = () => {
      if (!!show) {
         setShow(false)
      } else {
         setShow(true);
         setDayName('');
         setTempExercises([]);
         setDayError(0)
      }
   }

   const saveExercisesToDay = async () => {
      let tempDays = [...routineDays];

      if (dayName !== '') {
         if (tempExercises.length !== 0) {
            tempDays.push({ name: dayName, exercises: tempExercises })

            setRoutineDays(tempDays);
            setDayError(0);
            setShow(false)
         } else {
            setDayError(2)
         }
      } else {
         setDayError(1)
      }
   }

   const addRestDay = () => {
      let tempDays = [...routineDays];
      let currentAmountOfRestDays = tempDays.filter(e => e.name.includes('Rest Day')).length;

      tempDays.push({ name: `Rest Day #${currentAmountOfRestDays + 1}`, rest_day: true, exercises: [{ name: 'No exercises available.' }] });
      setRoutineDays(tempDays);
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
         <Modal show={show} onHide={() => setShow(false)} id="addDayModal">
            <Modal.Header closeButton>
               <Modal.Title>Add A Day</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form.Group controlId="formBasicEmail">
                  <Form.Label>Day Name: </Form.Label>
                  <Form.Control type="input" onChange={(e) => setDayName(e.target.value.trim())} placeholder="Ex. Push Day, Pull Day, Leg Day" />
               </Form.Group>
               <AddExercises clearDayError={clearDayError} />
               <div className="error-message">
                  <p>{errorMessage}</p>
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={(e) => setShow(false)}>Close</Button>
               <Button variant="primary" onClick={(e) => saveExercisesToDay(e)}>Save Day</Button>
            </Modal.Footer>
         </Modal>
      );
   }

   const displayDays = () => {

      return routineDays.length > 0 && routineDays.map((day, dayIdx) =>
         <div className="singleDayContainer" key={`day-${day.name}-${dayIdx}`}>
            <h4 className="dayName h4">Day {dayIdx + 1} - {day.name}</h4>
            <h6 className="exerciseHeader h6">Exercises:</h6>
            <ol>
               {day.exercises.map((exercise, idx) =>
                  <li key={`exercise-${day.name}-${idx}`}>
                     {exercise.name}
                  </li>
               )}
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
            <Button className="mb-3 btn-outline-primary" variant="light" onClick={(e) => modalTrigger(e)}>Add A Day</Button>
            <Button className="mb-3 ml-3 btn-outline-primary" variant="light" onClick={(e) => addRestDay(e)}>Add A Rest Day</Button>
         </Form>
      </div>
   )
}

export default AddDay;