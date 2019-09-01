import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Card, Button, Form, Alert } from "react-bootstrap";

import '../App.css';

class Login extends Component {
    state = {
        errorCode: -1,
        email: '',
        password: ''
    }

    handleEmail = (e) => { this.setState({ email: e.target.value }) }
    handlePassword = (e) => { this.setState({ password: e.target.value }) }

    login = async () => {
        const url = "http://localhost:3000/users/login";

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
            this.props.checkLoginStatus();
            /*
                Error Codes:

                0 = Success
                1 = No User Found
                2 = Password Incorrect
                3 = User Already Created
                4 = Database Error
                5 = URL to backend is bad
            */

        } catch (err) {
            this.setState({ errorCode: 5 });
        }
    }

    render() {
        const { errorCode } = this.state;

        return (
            <div>
                <Card className="loginSignUpContainer mt-5">
                    <Card.Header as="h5">Login</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" onChange={(e) => this.handleEmail(e)} placeholder="Enter email" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control autoComplete="on" type="password" onChange={(e) => this.handlePassword(e)} placeholder="Password" />
                            </Form.Group>
                            <Button className="mb-3" variant="danger" onClick={(e) => this.login()}>
                                Sign In
                        </Button>
                        </Form>
                        {
                            {
                                0: <Redirect to="/profile" />,
                                1:
                                    <Alert className="alert alert-dismissible alert-danger users-alert">
                                        <strong>Oops,</strong> <b>User was not found</b> , please register.
                                    </Alert>,
                                2:
                                    <Alert className="alert alert-dismissible alert-danger users-alert">
                                        <strong>Oops,</strong> <b>Password was Incorrect</b> , please try again.
                                    </Alert>,
                                3:
                                    <Alert className="alert alert-dismissible alert-danger users-alert">
                                        <strong>Oops,</strong> <b>Password was Incorrect</b> , please try again.
                                    </Alert>,
                                default:
                                    <Alert className="alert alert-dismissible alert-danger users-alert">
                                        <strong>We're sorry,</strong> <b>something wrong happened on our end</b> , please try again in a bit.
                                    </Alert>
                            }[errorCode]
                        }

                        <p className="mt-4">
                            No Account? <Link to="/register"><b>Register</b></Link>
                        </p>
                    </Card.Body>
                </Card >
            </div>
        )
    }
}

export default Login;