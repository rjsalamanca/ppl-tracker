import React, { Component } from "react";
import { Button, Form, Modal } from "react-bootstrap";

// add custom css here
import "../css/addExercisesStyle.css";

class AddExercises extends Component {
   state = {
      show: false,
      exercise_name: '',
      exercises: [],
      exercise_error: 0,
      sets: [],
   }

   handleClose = () => {
      let hidePreviousModal = document.getElementById('addDayModal').parentNode;
      hidePreviousModal.classList.remove("hideAddModal");
      this.setState({ show: false });
   }

   handleShow = () => {
      let hidePreviousModal = document.getElementById('addDayModal').parentNode;
      hidePreviousModal.classList.add("hideAddModal");
      this.setState({ show: true });
   }

   handleExerciseName = (e) => this.setState({ exercise_name: e.target.value });
   handleSetWeight = (e, idx) => {
      const { sets } = this.state;
      let newSets = [...sets];

      if (e.target.value === '') {
         newSets[idx].weight = null;
      } else {
         newSets[idx].weight = e.target.value.match(/([0-9])/g).join('');
      }

      this.setState({ sets: newSets });
   };

   handleSetReps = (e, idx) => {
      const { sets } = this.state;
      let newSets = [...sets];
      newSets[idx].reps = e.target.value;
      this.setState({ sets: newSets });
   };

   handleRemoveSets = (idx) => {
      const { sets } = this.state;
      let newSets = [...sets];
      newSets.splice(idx, 1);
      this.setState({ sets: newSets });
   }

   modalTrigger = () => {
      const { show } = this.state;
      this.props.clearDayError();
      this.setState({
         exercise_name: '',
         sets: [{ weight: null, reps: 1, initial_set: true }],
         exercise_error: 0
      });

      (!!show) ? this.handleClose() : this.handleShow();
   }

   addSet = () => {
      const { sets } = this.state;
      let newSets = [...sets];
      newSets.push({ weight: null, reps: 1 })
      this.setState({ sets: newSets });
   }

   displayReps = (maxReps) => {
      let repsOption = [];
      for (let i = 0; i <= maxReps; i++) {
         repsOption.push(i);
      }
      return repsOption;
   }

   saveExercise = async () => {
      const { exercises, exercise_name, sets } = this.state;
      let newExercises = [...exercises];
      let tempSets = sets.filter((set) => set.weight !== null);

      if (exercise_name !== '') {
         for (let i = 0; i < sets.length; i++) {
            if (sets[i].weight === null) {
               this.setState({ exercise_error: 1 })
               break;
            }
         }
         if (sets.length === tempSets.length) {
            newExercises.push({ name: exercise_name, sets })
            await this.setState({
               exercises: newExercises,
               exercise_error: 0
            })
            this.props.sendExercisesToDay(this.state.exercises);
            this.handleClose();
         }
      } else {
         this.setState({ exercise_error: 2 });
      }
   }

   displayExerciseModal = () => {
      const { show, exercise_error, sets } = this.state;
      let errorMessage = "";

      ////////////////////////////
      //     ERROR MESSAGES:    //
      ////////////////////////////
      // 0: Pass                //
      // 1: Blank sets detected //
      // 2: No Exercise Name    //
      ////////////////////////////

      if (exercise_error === 1) {
         errorMessage = "Please don't leave any sets blank.";
      } else if (exercise_error === 2) {
         errorMessage = "Please make sure to add an exercise name.";
      }

      return (
         <Modal show={show} onHide={this.handleClose}>
            <Modal.Header closeButton>
               <Modal.Title>Add An Exercise</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form.Group controlId="formBasicEmail">
                  <div>
                     Exercise Name: <Form.Control type="input" onChange={(e) => this.handleExerciseName(e)} placeholder="Ex. Push Day, Pull Day, Leg Day" />
                     {sets.map((set, idx) =>
                        <div key={`set-${idx + 1}`} className="setContainer">
                           <b className="boldtest">Set {idx + 1}</b><span className="weightRepsLabel">Weight:</span>
                           <input className="setWeight" type="text" placeholder=" Enter weight in lbs" onChange={e => this.handleSetWeight(e, idx)} value={sets[idx].weight === null ? '' : sets[idx].weight} />
                           <span className="weightRepsLabel">Reps:</span>
                           <select className="setReps" onChange={e => this.handleSetReps(e, idx)} value={sets[idx].reps === 0 && sets[idx].weight === null ? 1 : sets[idx].reps}>
                              {
                                 this.displayReps(25).map((ele, repIdx) =>
                                    <option key={`set${idx}-reps${ele}`}>{ele}</option>
                                 )
                              }
                           </select>
                           <Button className="setDelete" variant="danger" onClick={() => this.handleRemoveSets(idx)}>
                              X
                           </Button>
                        </div>
                     )}
                     <Button className="btn-outline-primary" variant="light" onClick={(e) => this.addSet(e)}>Add Set</Button>
                     <div className="exerciseError">
                        <p>{errorMessage}</p>
                     </div>
                  </div>
               </Form.Group>

            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={this.handleClose}>
                  Close
               </Button>
               <Button variant="primary" onClick={this.saveExercise}>
                  Save Excercise
               </Button>
            </Modal.Footer>
         </Modal>
      );
   }

   displayExercisesToDay = () => {
      const { exercises } = this.state;

      if (exercises.length === 0) {
         return 'No exercises added - add an exercise to your day'
      }

      return (
         exercises.map((exercise, idx) =>
            <div className="exerciseAndSets" key={`exercise-${idx}`}>
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
                     {exercise.sets.map((set, setIdx) =>
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

   render() {
      return (
         <div>
            {this.displayExerciseModal()}
            <h5 className="h5">Exercises:</h5>

            <div className="displayExercises">
               {this.displayExercisesToDay()}
            </div>
            <Form>
               <Button className="mb-3 btn-outline-primary" variant="light" onClick={(e) => this.modalTrigger(e)}>Add An Exercise</Button>
            </Form>
         </div >
      );
   }
}

export default AddExercises;