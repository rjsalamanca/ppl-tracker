import React, { Component } from 'react';
import { Card, Button, Form, Alert, Modal } from "react-bootstrap";

class addExercises extends Component {
    state = {
        test: 'testing state',
        show: false,
        day_name: '',
        exercise_name: '',
        exercises: [],
        exercise_error: 0,
        sets: [],
    }

    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });
    handleDayName = (e) => this.setState({ day_name: e.target.value });
    handleExerciseName = (e) => this.setState({ exercise_name: e.target.value });
    handleSetWeight = (e, idx) => {
        const { sets } = this.state;
        let newSets = [...sets];
        newSets[idx].value = e.target.value;
        this.setState({ sets: newSets });
    };

    handleRemoveSets = (idx) => {
        const { sets } = this.state;
        let newSets = [...sets];
        newSets.splice(idx, 1);
        this.setState({ sets: newSets });
    }

    modalTrigger = () => {
        const { show, sets } = this.state;
        this.setState({
            exercise_name: '',
            sets: [{ value: null }],
            exercise_error: 0
        });
        !!show ? this.setState({ show: false }) : this.setState({ show: true })
    }

    addSet = () => {
        const { sets } = this.state;
        let newSets = [...sets];
        newSets.push({ value: null })
        this.setState({ sets: newSets });
    }

    saveExercise = () => {
        const { exercises, exercise_name, sets } = this.state;
        let newExercises = [...exercises];
        let tempSets = sets.filter((set) => set.value !== null);
        console.log(exercise_name)
        console.log(sets)
        if (exercise_name !== '') {
            for (let i = 0; i < sets.length; i++) {
                if (sets[i].value === null) {
                    this.setState({ exercise_error: 1 })
                    break;
                }
            }
            if (sets.length === tempSets.length) {
                newExercises.push({ name: exercise_name, sets })
                //     this.setState({ exercises: newExercises })
                this.setState({
                    exercises: newExercises,
                    exercise_error: 0
                })
                this.handleClose();
            }

            // if (tempSets.length !== 0) {
            //     newExercises.push({ name: exercise_name, sets })
            //     this.setState({ exercises: newExercises })
            //     this.handleClose();
            // } else {
            //     console.log('error')
            //     this.setState({ exercise_error: 1 });
            // }
        } else {
            this.setState({ exercise_error: 2 });
        }
    }

    render() {
        const { show, exercises, exercise_error } = this.state;
        return (
            < div >
                <Modal show={show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add An Exercise</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formBasicEmail">
                            <div>
                                Exercise Name: <Form.Control type="input" onChange={(e) => this.handleExerciseName(e)} placeholder="Ex. Push Day, Pull Day, Leg Day" />
                                {this.state.sets.map((set, idx) =>
                                    <div key={`set-${idx + 1}`}>
                                        Set {idx + 1} Weight:
                                        <input type="text" placeholder="Enter weight in lbs" onChange={e => this.handleSetWeight(e, idx)} />
                                        <button type="button" onClick={() => this.handleRemoveSets(idx)}>
                                            X
                                        </button>
                                    </div>
                                )}
                                <Button variant="secondary" onClick={(e) => this.addSet(e)}>
                                    Add Set
                                </Button>
                                <div className="exerciseError">
                                    {
                                        {
                                            1: <p>Please don't leave any sets blank.</p>,
                                            2: <p>Please make sure to add an exercise name.</p>
                                        }[exercise_error]
                                    }
                                </div>
                            </div>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.saveExercise}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Day Name: </Form.Label>
                    <Form.Control type="input" onChange={(e) => this.handleDayName(e)} placeholder="Ex. Push Day, Pull Day, Leg Day" />
                </Form.Group>
                {exercises.map((exercise, idx) =>
                    <div key={`exercise-${idx}`}>
                        {exercise.name}
                    </div>
                )}
                <Form>
                    <Button className="mb-3" variant="danger" onClick={(e) => this.modalTrigger(e)}>Add Exercise</Button>
                    <Button className="m-3 btn-block" variant="success" onClick={(e) => alert('finish')}>Finish</Button>
                </Form>
            </div >
        );
    }
}

export default addExercises;