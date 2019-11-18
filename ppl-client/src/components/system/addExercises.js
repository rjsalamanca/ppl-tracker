import React, { Component } from 'react';
import { Card, Button, Form, Alert, Modal } from "react-bootstrap";

class addExercises extends Component {
    state = {
        test: 'testing state',
        show: false,
        days: []
    }

    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });
    modalTrigger = () => {
        const { show } = this.state;
        !!show ? this.setState({ show: false }) : this.setState({ show: true })
    }

    render() {
        const { show } = this.state;
        return (
            < div >
                <Modal show={show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a Day to Your Routine</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        Name of the Day:
                <Button variant="secondary">
                            Add Exercise
                </Button>

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
                <p> test Program</p>
                <Form>
                    <Button className="mb-3" variant="danger" onClick={(e) => this.modalTrigger(e)}>Add a Day</Button>
                </Form>
            </div >
        );
    }
}

export default addExercises;