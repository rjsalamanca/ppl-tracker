import React, { Component } from 'react';
import { Button, Form, Modal } from "react-bootstrap";

import AddExercises from './addExercises';

class addDay extends Component {
   state = {
      show: false,
      day_name: '',
      day_error: 0,
      routine_info: {},
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

   render() {
      const { show, days, day_error } = this.state;
      return (
         <div>
            {days.map((day) =>
               <div key={`day-${day.name}`}>
                  <h3>{day.name}</h3>
                  <ul>
                     {day.exercises.map((exercise, idx) =>
                        <li key={`exercise-${day.name}-${idx}`}>
                           {exercise.name}
                           <ul>
                              {exercise.sets.map((set, idx) =>
                                 <li key={`exercise-${day.name}-set-${idx + 1}`}>Set {idx + 1} : {set.weight} x {set.reps}</li>
                              )}
                           </ul>
                        </li>
                     )}
                  </ul>
               </div>
            )}
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
                  {
                     {
                        1: <div>Your day must have a name.</div>,
                        2: <div>Please Make sure to add exercises to your day.</div>
                     }[day_error]
                  }
               </Modal.Body>
               <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                     Close
                  </Button>
                  <Button variant="primary" onClick={this.saveExercisesToDay}>
                     Save Day
                  </Button>
               </Modal.Footer>
            </Modal>

            <Form>
               <Button className="mb-3 btn-outline-primary" variant="light" onClick={(e) => this.modalTrigger(e)}>Add A Day</Button>
               <Button className="btn-block" variant="primary" onClick={(e) => this.props.saveRoutine(days)}>Finish</Button>
            </Form>
         </div>
      )
   }
}

export default addDay;