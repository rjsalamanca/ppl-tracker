import React, { Component } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';

import './workoutInformationStyle.css'

class WorkoutInformation extends Component {
    state = { workout: {} }

    componentDidMount() {
        this.setState({ workout: this.props.selectedWorkout })
    }

    setCompleted = (e) => {
        let rowNode = e.target.parentNode.parentNode;
        if (rowNode.className !== 'table-success') {
            rowNode.className = 'table-success';
        } else {
            rowNode.className = '';
        }
    }

    finishWorkout = (e) => {
        e.preventDefault();
        console.log(e)
    }

    render() {
        const { workout } = this.state;
        // console.log(workout);
        return (
            <div className="workoutInfoContainer">
                <h3>{workout.day_name}</h3>
                <Form>
                    <Form.Group controlId="formBasicEmail">

                        {
                            Object.keys(workout).length === 0 ? <div></div> :
                                <div className="workoutInfo">
                                    {
                                        workout.exercises.map((exercise, exerciseIdx) =>
                                            <div key={`Workout-${workout.day_name}-${exercise.exercise_name}`} className="exerciseContainer">
                                                Exercise {`${exerciseIdx + 1} : ${exercise.exercise_name}`}
                                                <table className="table table-hover exerciseTable ">
                                                    <thead>
                                                        <tr className="bg-primary">
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
                                                                    <td><Form.Check id={`exercise${exerciseIdx + 1}-set${idx + 1}`} type="checkbox" name="set" value="completed" onClick={(e) => this.setCompleted(e)} /></td>
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
                        <Button className="mb-3" variant="danger" onClick={(e) => this.finishWorkout(e)}>
                            Sign In
                        </Button>
                    </Form.Group>
                </Form>

            </div>
        )
    }
}

export default WorkoutInformation;