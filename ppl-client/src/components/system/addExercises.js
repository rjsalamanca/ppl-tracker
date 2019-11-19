import React, { Component } from 'react';
import { Card, Button, Form, Alert, Modal } from "react-bootstrap";

class addExercises extends Component {
    state = {
        test: 'testing state',
        show: false,
        day_name: '',
        exercise_name: '',
        exercises: [],
        sets: []
    }

    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });
    handleDayName = (e) => this.setState({ day_name: e.target.value });
    handleExerciseName = (e) => this.setState({ exercise_name: e.target.value });

    modalTrigger = () => {
        const { show, sets } = this.state;
        this.setState({
            exercise_name: '',
            sets: [{ value: 0 }]
        });
        !!show ? this.setState({ show: false }) : this.setState({ show: true })
    }

    addSet = () => {
        const { sets } = this.state;
        let newSets = [...sets];
        newSets.push({ value: sets[sets.length - 1].value + 1 })
        this.setState({ sets: newSets });
    }

    render() {
        const { show, exercises } = this.state;
        return (
            < div >
                <Modal show={show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add An Exercise</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formBasicEmail">
                            <div>
                                Exercise Name: <Form.Control type="input" onChange={(e) => this.handleDayName(e)} placeholder="Ex. Push Day, Pull Day, Leg Day" />
                                {this.state.sets.map((set, idx) =>
                                    <div key={`set-${idx}`}>
                                        Set {idx + 1} Weight:
                                        <input type="text" placeholder="Enter weight in lbs" onChange={e => console.log('bro')} />
                                    </div>
                                )}
                                <Button variant="secondary" onClick={(e) => this.addSet(e)}>
                                    Add Set
                                </Button>
                            </div>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Day Name: </Form.Label>
                    <Form.Control type="input" onChange={(e) => this.handleDayName(e)} placeholder="Ex. Push Day, Pull Day, Leg Day" />
                </Form.Group>
                <Form>
                    <Button className="mb-3" variant="danger" onClick={(e) => this.modalTrigger(e)}>Add Exercise</Button>
                    <Button className="m-3 btn-block" variant="success" onClick={(e) => alert('finish')}>Finish</Button>
                </Form>
            </div >
        );
    }
}

export default addExercises;