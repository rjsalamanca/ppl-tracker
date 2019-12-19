import React, { Component } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

import './workoutInformationStyle.css'

class WorkoutInformation extends Component {
    state = { workout: {}, show: false }

    componentDidMount() {
        this.setState({ workout: this.props.selectedWorkout })
    }

    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });

    setCompleted = (e) => {
        let rowNode = e.target.parentNode.parentNode;
        (rowNode.className !== 'table-success') ? rowNode.className = 'table-success' : rowNode.className = '';
    }

    finishWorkout = (e) => {
        e.preventDefault();
        let checkWorkoutForm = document.getElementById('workoutForm').checkValidity();
        if (!!checkWorkoutForm) {
            // send
        } else {
            this.handleShow();
        }
    }

    render() {
        const { workout, show } = this.state;
        return (
            <div className="workoutInfoContainer">
                <Modal show={show} onHide={this.handleClose}>
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
                                be defaulted to zero reps. Click <a href="">here</a> to finish anyway.
                            </p>
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