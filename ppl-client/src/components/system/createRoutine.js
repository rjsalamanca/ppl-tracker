import React, { Component } from 'react';
import moment from 'moment';
import { Form, Button } from 'react-bootstrap';

class createRoutine extends Component {
    state = {
        routine_name: '',
        todays_date: moment(new Date()).format("MMM DD YYYY")
    };

    handleRoutine = (e) => this.setState({ routine_name: e.target.value });

    createRoutine = async () => {

        const url = "http://localhost:3000/ppl/create_routine"
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

            const data = await response.json();

            console.log(data)
        } catch (err) {
            console.log(err.message);
        }
    }

    render() {
        return (
            <div>
                create here
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Routine Name</Form.Label>
                        <Form.Control type="input" onChange={(e) => this.handleRoutine(e)} placeholder="Ex. Push Pull Legs" />
                    </Form.Group>

                    <Button className="mb-3" variant="danger" onClick={(e) => this.createRoutine(e)}>Create</Button>
                </Form>
            </div>
        );
    }
}

export default createRoutine;