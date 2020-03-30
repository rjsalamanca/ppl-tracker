import React, { Component } from 'react';
import { Button, Form, Modal } from "react-bootstrap";

import AddExercises from './addExercises';

import '../css/addDayStyle.css';

class addDay extends Component {
   state = {
      show: false,
      day_name: '',
      day_error: 0,
      temp_exercises: [],
      days: []
   }

   handleClose = () => this.setState({ show: false });
   handleShow = () => this.setState({ show: true });
   handleDayName = (e) => this.setState({ day_name: e.target.value });
   clearDayError = () => this.setState({ day_error: 0 });
   modalTrigger = () => {
      const { show } = this.state;
      !!show ? this.setState({ show: false }) : this.setState({ show: true, day_name: '', temp_exercises: [], day_error: 0 })
   }

   sendExercisesToDay = (exercises) => {
      this.setState({ temp_exercises: exercises })
   }

   saveExercisesToDay = async () => {
      const { days, day_name, temp_exercises } = this.state;
      let temp_days = [...days];

      if (day_name !== '') {
         if (temp_exercises.length !== 0) {
            temp_days.push({ name: day_name, exercises: temp_exercises })
            await this.setState({
               days: temp_days,
               day_error: 0
            })
            this.handleClose();
         } else {
            this.setState({ day_error: 2 });
         }
      } else {
         this.setState({ day_error: 1 });
      }
   }

   addRestDay = () => {
      const { days, } = this.state;
      let temp_days = [...days];

      temp_days.push({ name: 'Rest Day', exercises: [{ name: 'No exercises available.' }] });
      this.setState({ days: temp_days });
   }

   displayAddDayModal = () => {
      const { show, day_error } = this.state;
      let error_message = "";

      ////////////////////////////
      //     ERROR MESSAGES:    //
      ////////////////////////////
      // 0: Pass                //
      // 1: No day name         //
      // 2: No exercises added  //
      ////////////////////////////

      if (day_error === 1) {
         error_message = 'Your day must have a name.';
      } else if (day_error === 2) {
         error_message = 'Please nake sure to add exercises to your routine.';
      }
      return (
         <Modal show={show} onHide={this.handleClose} id="addDayModal">
            <Modal.Header closeButton>
               <Modal.Title>Add A Day</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form.Group controlId="formBasicEmail">
                  <Form.Label>Day Name: </Form.Label>
                  <Form.Control type="input" onChange={(e) => this.handleDayName(e)} placeholder="Ex. Push Day, Pull Day, Leg Day" />
               </Form.Group>
               <AddExercises clearDayError={this.clearDayError} sendExercisesToDay={this.sendExercisesToDay} />
               <div className="error-message">
                  <p>{error_message}</p>
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={this.handleClose}>Close</Button>
               <Button variant="primary" onClick={this.saveExercisesToDay}>Save Day</Button>
            </Modal.Footer>
         </Modal>
      );
   }

   displaySingleDay = (day) => {
      console.log(day)
   }
   displayDays = () => {
      const { days } = this.state;

      return days.map((day, dayIdx) =>
         <div className="singleDayContainer" key={`day-${day.name}-${dayIdx}`}>
            <h4 className="dayName h4">Day {dayIdx + 1} - {day.name}</h4>
            {this.displaySingleDay(day)}
            <h6 className="exerciseHeader h6">Exercises:</h6>
            <ol>
               {day.exercises.map((exercise, idx) =>
                  <li key={`exercise-${day.name}-${idx}`}>
                     {exercise.name}
                     {/* <ul>
                        {exercise.sets.map((set, idx) =>
                           <li key={`exercise-${day.name}-set-${idx + 1}`}>Set {idx + 1} : {set.weight} x {set.reps}</li>
                        )}
                     </ul> */}
                  </li>
               )}
            </ol>

         </div>
      )
   }

   // <h6 className="exerciseHeader h6">Exercises:</h6>
   // <ol>
   //    {day.exercises.map((exercise, idx) =>
   //       <li key={`exercise-${day.name}-${idx}`}>
   //          {exercise.name}
   //          {/* <ul>
   //             {exercise.sets.map((set, idx) =>
   //                <li key={`exercise-${day.name}-set-${idx + 1}`}>Set {idx + 1} : {set.weight} x {set.reps}</li>
   //             )}
   //          </ul> */}
   //       </li>
   //    )}
   // </ol>

   render() {
      const { days } = this.state;
      return (
         <div>
            {this.displayAddDayModal()}
            <div className="displayDaysContainer">
               {this.displayDays()}
            </div>
            <Form>
               <Button className="mb-3 btn-outline-primary" variant="light" onClick={(e) => this.modalTrigger(e)}>Add A Day</Button>
               <Button className="mb-3 ml-3 btn-outline-primary" variant="light" onClick={(e) => this.addRestDay(e)}>Add A Rest Day</Button>
               <Button className="btn-block" variant="primary" onClick={(e) => this.props.saveRoutine(days)}>Finish</Button>
            </Form>
         </div>
      )
   }
}

export default addDay;