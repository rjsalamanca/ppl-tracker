import React, { Component } from 'react';
import { Card, Button, Form, Alert, Modal, ThemeProvider } from "react-bootstrap";

import AddExercises from './addExercises';

class addDay extends Component {
    state = {
        show: false,
        day_name: '',
        day_error: 0,
        temp_exercises: [],
        days: []
    }

    componentDidMount() {
        console.log(this.props.location.state.routine_info)
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
        console.log('test')
        if (day_name !== '') {
            console.log('temp_ex', temp_exercises)
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

    saveRoutine = async () => {
        const url = "http://localhost:3000/ppl/routine/add_routine"
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(this.state)
            });

            // const data = await response.json();
            // console.log(data.routine_added)
            // console.log('test :', !!data.routine_added)

        } catch (err) {
            console.log(err.message);
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
                                            <li key={`exercise-${day.name}-set-${idx + 1}`}>Set {idx + 1} : {set.weight} x 10</li>
                                        )}
                                    </ul>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
                <Modal show={show} onHide={this.handleClose}>
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
                    <Button className="mb-3" variant="danger" onClick={(e) => this.modalTrigger(e)}>Add Day</Button>
                    <Button className="m-3 btn-block" variant="success" onClick={(e) => this.saveRoutine()}>Finish</Button>
                </Form>
            </div>
        )
    }
}

export default addDay;