import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import { Card, Form, Button, Alert } from 'react-bootstrap';

class Register extends Component {
    state = {
        errorCode: -1,
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    }

    handleFirstName = (e) => { this.setState({ first_name: e.target.value }) };
    handleLastName = (e) => { this.setState({ last_name: e.target.value }) };
    handleEmail = (e) => { this.setState({ email: e.target.value }) };
    handlePassword = (e) => { this.setState({ password: e.target.value }) };

    createUser = async (e) => {
        e.preventDefault();

        const formCheck = document.getElementById('registerForm').checkValidity();
        const url = "http://localhost:3000/users/register"

        //formCheck returns true or false. If everything on the form is correct
        //connect to the database;
        if (!!formCheck) {
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    credentials: 'include',
                    body: JSON.stringify(this.state)
                })

                const data = await response.json();

                this.setState({ errorCode: data.errorCode });
                console.log(this.state.errorCode);
            } catch (err) {
                // Can't connect to Database
                this.setState({ errorCode: 6 });
            }
        }
    }

    render() {
        const { errorCode } = this.state;
        return (
            <div>
                <Card className="loginSignUpContainer mt-5" >
                    <Card.Header as="h5">Register</Card.Header>
                    <Card.Body>
                        <Form id="registerForm">
                            <Form.Group controlId="formFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" name="f_name" className="form-control" placeholder="First Name" onChange={(e) => this.handleFirstName(e)} required />
                            </Form.Group>
                            <Form.Group controlId="formLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" name="l_name" className="form-control" placeholder="Last Name" onChange={(e) => this.handleLastName(e)} required />
                            </Form.Group>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" minLength="1" name="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => this.handleEmail(e)} required />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" autoComplete="on" name="password" className="form-control" placeholder="Password" onChange={(e) => this.handlePassword(e)} required />
                            </Form.Group>
                            <Button className="mb-3" type="submit" variant={'danger'} onClick={(e) => this.createUser(e)}>Submit</Button>
                        </Form>
                        {
                            {
                                0:
                                    // Success
                                    <Redirect to={{ pathname: '/login', errorCode }} />,
                                3:
                                    // User is Already Created 
                                    <Alert className="alert alert-dismissible alert-danger users-alert">
                                        <strong>This email is already in use.</strong> Please register with a different email.
                                    </Alert>,
                                4:
                                    // Can't connect to database 
                                    <Alert className="alert alert-dismissible alert-danger users-alert">
                                        <strong>Uh Oh, we are currently having issues.</strong> Please send let us know you have the following <b>Error Code: {errorCode}</b>
                                    </Alert>,
                                6:
                                    // Can't connect to the back end
                                    <Alert className="alert alert-dismissible alert-danger users-alert">
                                        <strong>Uh Oh, we are currently having issues.</strong> Please send let us know you have the following <b>Error Code: {errorCode}</b>
                                    </Alert>
                            }[errorCode]
                        }

                        <p className="mt-4">Already have an account? <Link to="/login"><b>Login Here</b></Link></p>
                    </Card.Body>
                </Card >
            </div>
        );
    }
}

export default Register;