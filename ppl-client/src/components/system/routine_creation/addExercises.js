import React, { useState, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";

import { CreateRoutineContext } from '../../../contexts/CreateRoutineContext';

import "../css/addExercisesStyle.css";

function AddExercises(props) {
   const [show, setShow] = useState(false);
   const [exerciseName, setExerciseName] = useState('');
   const [exerciseError, setExerciseError] = useState(0);
   const [exerciseSets, setExerciseSets] = useState([]);
   const [editing, setEditing] = useState({ name: '', sets: [], idx: null, status: false });
   const { exercises, setExercises, tempExercises, setTempExercises } = useContext(CreateRoutineContext);

   const handleClose = () => {
      const hidePreviousModal = document.getElementById('addDayModal').parentNode;
      hidePreviousModal.classList.remove("hideAddModal");

      console.log(editing);
      setShow(false);
      setExerciseSets(exerciseSets.map(e => e.hasOwnProperty('deleted') ? e.deleted = false : ''));
      setEditing({ name: '', sets: [], idx: null, status: false });
   }

   const handleShow = () => {
      const hidePreviousModal = document.getElementById('addDayModal').parentNode;
      hidePreviousModal.classList.add("hideAddModal");
      setShow(true);
   }

   const handleExerciseName = e => {
      // Shallow Copy Editing
      const newSets = { ...editing };
      newSets.name = e.target.value;
      setEditing(newSets);
   }

   const handleSetWeight = (e, idx) => {
      // Shallow Copy Editing
      const newSets = { ...editing };

      if (e.target.value === '' || e.target.value.match(/([^0-9])/g)) {
         newSets.sets[idx].weight = null;
      } else {
         newSets.sets[idx].weight = parseInt(e.target.value.match(/([0-9])/g).join(''));
      }
      setEditing(newSets);
   };

   const handleSetReps = (e, idx) => {
      // Shallow Copy Editing
      const newSets = { ...editing };
      newSets.sets[idx].reps = e.target.value;
      setEditing(newSets);
   };

   const removeSets = (idx) => {
      // Shallow Copy Editing
      const newSets = { ...editing };
      if (newSets.sets[idx].hasOwnProperty('id')) {
         newSets.sets[idx]['deleted'] = true;
      } else {
         newSets.sets.splice(idx, 1);
      }
      setEditing(newSets);
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
      // DEEP COPY
      const deepCopyExercise = JSON.parse(JSON.stringify(tempExercises[idx]));

      props.clearDayError();

      setEditing({ name: deepCopyExercise.name, sets: deepCopyExercise.sets, idx, status: true });
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
      let newSets = { ...editing };

      newSets.sets.push({ weight: null, newset: true, reps: 1, set: newSets.length + 1, set_date: null });
      setEditing(newSets);
   }

   const displayReps = (maxReps) => {
      let repsOption = [];

      for (let i = 0; i <= maxReps; i++) {
         repsOption.push(i);
      }
      return repsOption;
   }

   const saveExercise = async () => {
      const newExercises = [...exercises];
      const emptySets = editing.sets.filter((set) => set.weight === null);
      const countDeleted = editing.sets.map(e => e.hasOwnProperty('deleted') ? e.deleted : false).filter(ed => ed === true).length;

      console.log(editing);
      if (editing.sets.length === 0) {
         setExerciseError(3)
         console.log('1');
      } else {
         if (editing.name !== '') {
            if (emptySets.length > 0) {
               console.log('2');
               setExerciseError(1)
            } else if (editing.sets.length !== countDeleted) {
               console.log('3');
               newExercises.push({ name: editing.name, sets: editing.sets, newExercise: true })

               // newExercises[editing.idx] = { id: exercises[editing.idx].id, name: editing.name, routine_day_id: exercises[editing.idx].routine_day_id, sets: editing.sets };
               setExercises(newExercises);
               setExerciseError(0);
               setTempExercises(newExercises);
               handleClose();
            } else {
               console.log('4');

               setExerciseError(1)
            }
         } else {
            console.log('5');

            setExerciseError(2)
         }
      }
   }

   const saveEditExercise = () => {
      const emptySets = editing.sets.filter((set) => set.weight === null);
      const countDeleted = editing.sets.map(e => e.hasOwnProperty('deleted') ? e.deleted : false).filter(ed => ed === true).length;
      let newExercises = [...exercises];

      if (editing.sets.length === 0) {
         setExerciseError(3);
      } else {
         if (editing.name !== '') {
            if (emptySets.length > 0) {
               setExerciseError(1)
            } else if (editing.sets.length !== countDeleted) {
               newExercises[editing.idx] = { id: exercises[editing.idx].id, name: editing.name, routine_day_id: exercises[editing.idx].routine_day_id, sets: editing.sets };
               setExercises(newExercises);
               setExerciseError(0);
               setTempExercises(newExercises);
               handleClose();
            } else {
               setExerciseError(1)
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
                     Exercise Name:
                     <Form.Control className="mb-3" type="input" onChange={(e) => handleExerciseName(e)} value={editing.name} placeholder="Ex. Push Day, Pull Day, Leg Day" />
                     {editing.sets !== null && editing.sets.map((set, idx) =>
                        (set.deleted === undefined || !set.deleted) &&
                        <div key={`set-${idx + 1}`} className="setContainer">
                           <b className="boldtest">Set {idx + 1}</b><span className="weightRepsLabel">Weight:</span>
                           <input className="setWeight" type="text" placeholder=" Enter weight in lbs" onChange={e => handleSetWeight(e, idx)} value={editing.sets[idx].weight === null ? '' : editing.sets[idx].weight} />
                           <span className="weightRepsLabel">Reps:</span>
                           <select className="setReps" onChange={e => handleSetReps(e, idx)} value={editing.sets[idx].reps === 0 && editing.sets[idx].weight === null ? 1 : editing.sets[idx].reps}>
                              {
                                 displayReps(25).map(ele => <option key={`set${idx}-reps${ele}`}>{ele}</option>)
                              }
                           </select>
                           <Button className="setDelete" variant="danger" onClick={() => removeSets(idx)}>X</Button>
                        </div>
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
                     <Button variant="primary" onClick={(e) => saveExercise(e)}>Save Exercise</Button>
               }

            </Modal.Footer>
         </Modal>
      );
   }

   const displayExercisesToDay = () => {
      // Check if exercises has the 'deleted' key then filter all of them by the deleted:true values.

      const countDeleted = exercises.map(e => e.hasOwnProperty('deleted') ? e.deleted : false).filter(ed => ed === true).length;
      if (exercises.length === 0 || (countDeleted.length === exercises.length)) {
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
                        (set.deleted === undefined || !set.deleted) &&
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