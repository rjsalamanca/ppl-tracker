import React, { Component } from 'react';
import { Card, Button, Form, Alert, Modal } from "react-bootstrap";

class addExercises extends Component {
    state = {
        test: 'testing state',
        show: false,
        setShow: false
    }

    Example() {
        const { show, setShow } = this.state;

        const handleClose = () => this.setState({ show: false });
        const handleShow = () => this.setState({ show: true });

        return (
            <>
                <Button variant="primary" onClick={handleShow}>
                    Launch demo modal
            </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Save Changes
                </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    render() {
        return (
            < div >
                {this.Example()}
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