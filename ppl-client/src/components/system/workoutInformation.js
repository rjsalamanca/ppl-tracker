import React, { useState, useContext } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import moment from 'moment';

import { UserContext } from '../../UserContext';

import './css/workoutInformationStyle.css'

function WorkoutInformation() {
   const [showEndEarly, setShowEndEarly] = useState(false);
   const [showSaving, setShowSaving] = useState(false);
   const [completedWorkout, setCompletedWorkout] = useState(false);

   const { selectedWorkout } = useContext(UserContext);


   const handleClose = () => {
      setShowEndEarly(false);
      setShowSaving(false);
   }
   const handleShowEndEarly = () => setShowEndEarly(true);

   const setCompleted = (e) => {
      let rowNode = e.target.parentNode.parentNode;
      (rowNode.className !== 'table-success') ? rowNode.className = 'table-success' : rowNode.className = '';
   }

   const finishWorkout = async (e) => {
      e.preventDefault();
      const url = "http://localhost:3000/ppl/routine/finish_workout";
      let checkWorkoutForm = document.getElementById('workoutForm').checkValidity();
      if (!!checkWorkoutForm) {
         let sendData = {
            workout: selectedWorkout,
            workout_date: moment(new Date()).format("MMM DD YYYY")
         }

         setShowSaving(true);

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
                  setShowSaving(false);
               }, 1000);

               await setTimeout(() => {
                  setCompletedWorkout(true);
               }, 500);
            }
         } catch (err) {
            console.log(err.message);
         }
      } else {
         handleShowEndEarly();
      }
   }

   return (
      <div className="workoutInfoContainer">
         {!!completedWorkout && <Redirect to="/" />}

         {/* Modal For ending workout early.  */}
         <Modal show={showEndEarly} onHide={handleClose}>
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

         <Modal show={showSaving} onHide={handleClose}>
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
               <Button className="mb-3" variant="primary" type="submit" onClick={(e) => finishWorkout(e)}>
                  Finish Workout
               </Button>
               <Button className="mb-3" variant="primary" type="submit" onClick={(e) => finishWorkout(e)}>
                  Cancel Workout
               </Button>
            </div>

            <h3 className="workoutTitle">{selectedWorkout.day_name}</h3>
            <Form id="workoutForm">
               <Form.Group controlId="formBasicEmail">
                  {
                     Object.keys(selectedWorkout).length === 0 ? <div></div> :
                        <div className="workoutInfo">
                           {
                              selectedWorkout.exercises.map((exercise, exerciseIdx) =>
                                 <div key={`Workout-${selectedWorkout.day_name}-${exercise.exercise_name}`} className="exerciseContainer">
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
                                                <tr key={`Workout-${selectedWorkout.day_name}-${exercise.exercise_name}-Set${idx}`}>
                                                   <th scope="row">{idx + 1}</th>
                                                   <td>{set.weight}lbs</td>
                                                   <td>{set.reps}</td>
                                                   <td><input id={`exercise${exerciseIdx + 1}-set${idx + 1}`} type="checkbox" name="set" value="completed" onClick={(e) => setCompleted(e)} required /></td>
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

export default WorkoutInformation;