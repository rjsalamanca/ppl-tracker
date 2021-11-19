import React, { useState, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";

import { CreateRoutineContext } from '../../../contexts/CreateRoutineContext';

import "../css/addExercisesStyle.css";

function AddExercises(props) {
   const [show, setShow] = useState(false);
   const [exerciseName, setExerciseName] = useState('');
   const [exerciseError, setExerciseError] = useState(0);
   const [exerciseSets, setExerciseSets] = useState([]);
   const [editing, setEditing] = useState({ idx: null, status: false });

   const { exercises, setExercises, tempExercises, setTempExercises } = useContext(CreateRoutineContext);

   const handleClose = () => {
      let hidePreviousModal = document.getElementById('addDayModal').parentNode;
      hidePreviousModal.classList.remove("hideAddModal");
      setShow(false);
   }

   const handleShow = () => {
      const hidePreviousModal = document.getElementById('addDayModal').parentNode;
      hidePreviousModal.classList.add("hideAddModal");
      setShow(true);
   }

   const handleSetWeight = (e, idx) => {
      const newSets = [...exerciseSets];

      if (e.target.value === '' || e.target.value.match(/([^0-9])/g)) {
         newSets[idx].weight = null;
      } else {
         newSets[idx].weight = parseInt(e.target.value.match(/([0-9])/g).join(''));
      }
      setExerciseSets(newSets);
   };

   const handleSetReps = (e, idx) => {
      const newSets = [...exerciseSets];
      newSets[idx].reps = e.target.value;
      setExerciseSets(newSets);
   };

   const removeSets = (idx) => {
      const newSets = [...exerciseSets];
      if (newSets[idx].hasOwnProperty('id')) {
         newSets[idx]['deleted'] = true;
      } else {
         newSets.splice(idx, 1);
      }
      setExerciseSets(newSets);
   }

   const removeExercise = (idx) => {
      const tempDays = [...exercises];
      if (tempDays[idx].hasOwnProperty('id')) {
         tempDays[idx]['deleted'] = true;
      } else {
         tempDays.splice(idx, 1);
      }

      setTempExercises(tempDays)
      setExercises(tempDays);
   }

   const editExercise = (idx) => {
      props.clearDayError();

      setEditing({ idx, status: true });
      setExerciseName(tempExercises[idx].name);
      setExerciseSets(tempExercises[idx].sets)
      setExerciseError(0);

      (!!show) ? handleClose() : handleShow();
   }

   const modalTrigger = () => {
      props.clearDayError();

      setExerciseName('');
      setExerciseSets([{ weight: null, reps: 1, initial_set: true }]);
      setExerciseError(0);

      (!!show) ? handleClose() : handleShow();
   }

   const addSet = () => {
      let newSets = [...exerciseSets];

      newSets.push({ weight: null, newset: true, reps: 1, set: newSets.length + 1, set_date: null })
      setExerciseSets(newSets)
   }

   const displayReps = (maxReps) => {
      let repsOption = [];

      for (let i = 0; i <= maxReps; i++) {
         repsOption.push(i);
      }
      return repsOption;
   }

   const saveExercise = async () => {
      let newExercises = [...exercises];

      let tempSets = exerciseSets.filter((set) => set.weight !== null);
      if (exerciseSets.length === 0) {
         setExerciseError(3)
      } else {
         if (exerciseName !== '') {
            for (let i = 0; i < exerciseSets.length; i++) {
               if (exerciseSets[i].weight === null) {
                  setExerciseError(1)
                  break;
               }
            }
            if (exerciseSets.length === tempSets.length) {
               console.log(newExercises);
               newExercises.push({ name: exerciseName, sets: exerciseSets, newExercise: true })

               setExercises(newExercises);
               setExerciseError(0);
               setTempExercises(newExercises);
               handleClose();
            }
         } else {
            setExerciseError(2)
         }
      }
   }

   const saveEditExercise = () => {
      let newExercises = [...exercises];
      let tempSets = exerciseSets.filter((set) => set.weight !== null);
      console.log(newExercises);
      if (exerciseSets.length === 0) {
         setExerciseError(3)
      } else {
         if (exerciseName !== '') {
            for (let i = 0; i < exerciseSets.length; i++) {
               if (exerciseSets[i].weight === null) {
                  setExerciseError(1)
                  break;
               }
            }

            if (exerciseSets.length === tempSets.length) {

               newExercises[editing.idx] = ({ id: exercises[editing.idx].id, name: exerciseName, routine_day_id: exercises[editing.idx].routine_day_id, sets: exerciseSets })
               setExercises(newExercises);
               setExerciseError(0);
               setTempExercises(newExercises);
               handleClose();
               console.log('1')
            } else {
               console.log('2')
            }
         } else {
            setExerciseError(2)
         }
      }
   }

   const displayExerciseModal = () => {
      let errorMessage = "";

      ////////////////////////////
      //     ERROR MESSAGES:    //
      ////////////////////////////
      // 0: Pass                //
      // 1: Blank sets detected //
      // 2: No Exercise Name    //
      // 3: No sets detected    //
      ////////////////////////////

      if (exerciseError === 1) {
         errorMessage = "Please don't leave any sets blank.";
      } else if (exerciseError === 2) {
         errorMessage = "Please make sure to add an exercise name.";
      } else if (exerciseError === 3) {
         errorMessage = "Please make sure to add atleast 1 set.";
      }

      return (
         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
               <Modal.Title>Add An Exercise</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form.Group controlId="formBasicEmail">
                  <div>
                     Exercise Name: <Form.Control type="input" onChange={(e) => setExerciseName(e.target.value)} value={exerciseName} placeholder="Ex. Push Day, Pull Day, Leg Day" />
                     {exerciseSets.map((set, idx) => {
                        return !set.hasOwnProperty('deleted') &&
                           <div key={`set-${idx + 1}`} className="setContainer">
                              <b className="boldtest">Set {idx + 1}</b><span className="weightRepsLabel">Weight:</span>
                              <input className="setWeight" type="text" placeholder=" Enter weight in lbs" onChange={e => handleSetWeight(e, idx)} value={exerciseSets[idx].weight === null ? '' : exerciseSets[idx].weight} />
                              <span className="weightRepsLabel">Reps:</span>
                              <select className="setReps" onChange={e => handleSetReps(e, idx)} value={exerciseSets[idx].reps === 0 && exerciseSets[idx].weight === null ? 1 : exerciseSets[idx].reps}>
                                 {
                                    displayReps(25).map((ele, repIdx) =>
                                       <option key={`set${idx}-reps${ele}`}>{ele}</option>
                                    )
                                 }
                              </select>
                              <Button className="setDelete" variant="danger" onClick={() => removeSets(idx)}>
                                 X
                              </Button>
                           </div>
                     }
                     )}
                     <Button className="btn-outline-primary" variant="light" onClick={(e) => addSet(e)}>Add Set</Button>
                     <div className="exerciseError">
                        <p>{errorMessage}</p>
                     </div>
                  </div>
               </Form.Group>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleClose}>Close</Button>

               {
                  !!editing.status ?
                     <Button variant="primary" onClick={(e) => saveEditExercise(e)}>Edit Exercises</Button>
                     :
                     <Button variant="primary" onClick={(e) => saveExercise(e)}>Save Day</Button>
               }

            </Modal.Footer>
         </Modal>
      );
   }

   const displayExercisesToDay = () => {
      // Check if exercises has the 'deleted' key then filter all of them by the deleted:true values.
      const findExercisesDeleted = exercises.map(e => e.hasOwnProperty('deleted')).filter(ed => !!ed.deleted);
      if (exercises.length === 0 || (findExercisesDeleted.length === exercises.length)) {
         return 'No exercises added - add an exercise to your day'
      }

      return (
         exercises.map((exercise, idx) =>
            (!exercise.deleted === undefined || !exercise.deleted) &&
            <div className="exerciseAndSets" key={`exercise-${idx}`}>
               <Button className="deleteExercise" variant="secondary" onClick={() => removeExercise(idx)}>X</Button>
               <Button className="editExercise" variant="secondary" onClick={() => editExercise(idx)}>Edit</Button>
               <h4 className="table-primary h4 text-center pt-2 pb-2">{exercise.name}</h4>
               <table className="table table-striped table-hover exercise-table">
                  <thead>
                     <tr>
                        <th scope="col">Set</th>
                        <th scope="col">Weight</th>
                        <th scope="col">Rep</th>
                     </tr>
                  </thead>
                  <tbody>
                     {/* Only show exercises that don't have the deleted key*/}
                     {exercise.sets.map((set, setIdx) =>
                        !set.hasOwnProperty('deleted') &&
                        <tr key={`exercise-${exercise.name}-set-${setIdx + 1}-table`}>
                           <th scope="row">{setIdx + 1}</th>
                           <td>{set.weight}lbs</td>
                           <td>{set.reps}</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div >
         )
      );
   }

   return (
      <div>
         {displayExerciseModal()}
         <h5 className="h5">Exercises:</h5>

         <div className="displayExercises">
            {displayExercisesToDay()}
         </div>
         <Form>
            <Button className="mb-3 btn-outline-primary" variant="light" onClick={(e) => modalTrigger(e)}>Add An Exercise</Button>
         </Form>
      </div >
   );
}

export default AddExercises;