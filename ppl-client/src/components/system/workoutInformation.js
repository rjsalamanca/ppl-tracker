import React, { Component } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import moment from 'moment';

import './css/workoutInformationStyle.css'

class WorkoutInformation extends Component {
   state = {
      workout: {},
      showEndEarly: false,
      showSaving: false,
      saving: false,
      completed: false
   }

   componentDidMount() {
      this.setState({ workout: this.props.selectedWorkout })
   }

   handleClose = () => this.setState({ showEndEarly: false, showSaving: false });
   handleShowEndEarly = () => this.setState({ showEndEarly: true });
   handleShowSaving = () => this.setState({ showSaving: true });

   setCompleted = (e) => {
      let rowNode = e.target.parentNode.parentNode;
      (rowNode.className !== 'table-success') ? rowNode.className = 'table-success' : rowNode.className = '';
   }

   finishWorkout = async (e) => {
      e.preventDefault();
      const url = "http://localhost:3000/ppl/routine/finish_workout";
      let checkWorkoutForm = document.getElementById('workoutForm').checkValidity();
      if (!!checkWorkoutForm) {
         let sendData = {
            workout: this.state.workout,
            workout_date: moment(new Date()).format("MMM DD YYYY")
         }

         this.setState({ showSaving: true });

         try {
            const response = await fetch(url, {
               method: "POST",
               headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
               },
               credentials: 'include',
               body: JSON.stringify(sendData)
            });

            const data = await response.json();
            if (!!data.completed_workout) {
               await setTimeout(() => {
                  this.setState({ showSaving: false });
               }, 1000);

               await setTimeout(() => {
                  this.setState({ completed: true });
               }, 500);
            }
         } catch (err) {
            console.log(err.message);
         }
      } else {
         this.handleShowEndEarly();
      }
   }

   render() {
      const { workout, showEndEarly, showSaving, completed } = this.state;
      console.log(workout)
      return (
         <div className="workoutInfoContainer">
            {!!completed && <Redirect to="/" />}

            {/* Modal For ending workout early.  */}
            <Modal show={showEndEarly} onHide={this.handleClose}>
               <Modal.Header closeButton>
                  <Modal.Title >Uh Oh...</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <div>
                     <h5 className="h5 text-center">You haven't finished the workout yet!</h5>
                     <p className="mb-3 mt-3 text-center">
                        To finish the workout, make sure you've checked off each set.
                        When you've completed a set, the set will turn green!
                     </p>
                     <p className="alert alert-danger">
                        If you really want to end the workout, the rest of your sets will
                        be defaulted to zero reps. Click <a href="./">here</a> to finish anyway.
                     </p>
                  </div>
               </Modal.Body>
            </Modal>

            <Modal show={showSaving} onHide={this.handleClose}>
               <Modal.Header closeButton>
                  <Modal.Title >SAVING</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <div>
                     We are saving right now
                  </div>
               </Modal.Body>
            </Modal>

            <div className="workoutInnerContainer">
               <div className="workoutButtonContainer">
                  <Button className="mb-3" variant="primary" type="submit" onClick={(e) => this.finishWorkout(e)}>
                     Finish Workout
                  </Button>
                  <Button className="mb-3" variant="primary" type="submit" onClick={(e) => this.finishWorkout(e)}>
                     Cancel Workout
                  </Button>
               </div>

               <h3 className="workoutTitle">{workout.day_name}</h3>
               <Form id="workoutForm">
                  <Form.Group controlId="formBasicEmail">
                     {
                        Object.keys(workout).length === 0 ? <div></div> :
                           <div className="workoutInfo">
                              {
                                 workout.exercises.map((exercise, exerciseIdx) =>
                                    <div key={`Workout-${workout.day_name}-${exercise.exercise_name}`} className="exerciseContainer">
                                       <b className="exerciseName">Exercise {`${exerciseIdx + 1} : ${exercise.exercise_name}`}</b>
                                       <table className="table table-hover exerciseTable ">
                                          <thead>
                                             <tr className="bg-primary text-white">
                                                <th scope="col">SET</th>
                                                <th scope="col">WEIGHT</th>
                                                <th scope="col">REPS</th>
                                                <th scope="col">X</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {
                                                exercise.sets.map((set, idx) =>
                                                   <tr key={`Workout-${workout.day_name}-${exercise.exercise_name}-Set${idx}`}>
                                                      <th scope="row">{idx + 1}</th>
                                                      <td>{set.weight}lbs</td>
                                                      <td>{set.reps}</td>
                                                      <td><input id={`exercise${exerciseIdx + 1}-set${idx + 1}`} type="checkbox" name="set" value="completed" onClick={(e) => this.setCompleted(e)} required /></td>
                                                   </tr>
                                                )
                                             }
                                          </tbody>
                                       </table>
                                    </div>
                                 )
                              }
                           </div>
                     }
                  </Form.Group>
               </Form>
            </div>
         </div>
      )
   }
}

export default WorkoutInformation;