import React, { Component } from 'react';
import { Card, Button, Form, Alert, Modal } from "react-bootstrap";

class addExercises extends Component {
    state = {
        show: false,
        exercise_name: '',
        exercises: [],
        exercise_error: 0,
        sets: [],
    }

    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });
    handleExerciseName = (e) => this.setState({ exercise_name: e.target.value });
    handleSetWeight = (e, idx) => {
        const { sets } = this.state;
        let newSets = [...sets];
        newSets[idx].weight = e.target.value;
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
        this.props.clearDayError();
        this.setState({
            exercise_name: '',
            sets: [{ weight: null }],
            exercise_error: 0
        });
        !!show ? this.setState({ show: false }) : this.setState({ show: true })
    }

    addSet = () => {
        const { sets } = this.state;
        let newSets = [...sets];
        newSets.push({ weight: null })
        this.setState({ sets: newSets });
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
                            Save Excercise
                        </Button>
                    </Modal.Footer>
                </Modal>

                {exercises.map((exercise, idx) =>
                    <div key={`exercise-${idx}`}>
                        {exercise.name}
                        <ul>
                            {exercise.sets.map((set, setIdx) =>
                                <li key={`${exercise.name}-set-${setIdx}`}>
                                    <b>Set {setIdx + 1}</b> {set.weight}lbs x 10
                                </li>
                            )}
                        </ul>
                    </div>
                )}
                <Form>
                    <Button className="mb-3" variant="danger" onClick={(e) => this.modalTrigger(e)}>Add Exercise</Button>
                </Form>
            </div >
        );
    }
}

export default addExercises;