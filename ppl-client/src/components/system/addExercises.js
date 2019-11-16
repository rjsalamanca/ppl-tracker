import React, { Component } from 'react';
import { Card, Button, Form, Alert } from "react-bootstrap";

class addExercises extends Component {
    state = { test: 'testing state' }

    render() {
        return (
            < div >
                <p>Program</p>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Routine Name</Form.Label>
                        <Form.Control type="input" onChange={(e) => this.handleRoutine(e)} placeholder="Ex. Push Pull Legs" />
                    </Form.Group>

                    <Button className="mb-3" variant="danger" onClick={(e) => this.createRoutine(e)}>Create</Button>
                </Form>
            </div >
        );
    }
}

export default addExercises;