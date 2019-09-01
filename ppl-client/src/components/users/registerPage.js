import React, { Component } from 'react';
import { Card, Form } from 'react-bootstrap';

class Register extends Component {
    state = { errorCode: -1 }

    render() {
        return (
            <div>
                <Card className="loginSignUpContainer mt-5" >
                    <Card.Header as="h5">Register as a Zombie Killer</Card.Header>
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
                            {/* <Form.Group controlId="formEmail"> */}
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" minLength="1" name="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => this.handleEmail(e)} required />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                            {/* </Form.Group> */}
                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" autoComplete="on" name="password" className="form-control" placeholder="Password" onChange={(e) => this.handlePassword(e)} required />
                            </Form.Group>
                            <Button className="mb-3" type="submit" variant={'danger'} onClick={(e) => this.createUser(e)}>Submit</Button>
                        </Form>
                        {errorCode === 3 ?
                            <Alert className="alert alert-dismissible alert-danger users-alert">
                                <strong>Oh $h%+!</strong> This user is already fighting the undead.
                        </Alert>
                            : (errorCode === 4 || errorCode === 6)
                                ?
                                <Alert className="alert alert-dismissible alert-danger users-alert">
                                    <strong>Uh Oh, we are currently having issues.</strong> Please send let us know you have the following <b>Error Code: {errorCode}</b>
                                </Alert>
                                : ``}
                        <p className="mt-4">Already have an account? <Link to="/login"><b>Login Here</b></Link></p>
                        {(!!createdAccount) ? <Redirect to={{
                            pathname: '/login',
                            errorCode
                        }} /> : ''}
                    </Card.Body>
                </Card >
            </div>
        );
    }
}

export default Register;