import React, { useState } from 'react';
import { Link, Redirect } from "react-router-dom";
import { Card, Form, Button, Alert } from 'react-bootstrap';

function Register() {
   const [errorCode, setErrorCode] = useState(-1);
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const createUser = async (e) => {
      console.log('bruh')
      const formCheck = document.getElementById('registerForm').checkValidity();
      const url = "http://localhost:3000/users/register"

      ////////////////////////////////////
      //          ERROR CODES:          //
      ////////////////////////////////////
      // 0 = Success                    //
      // 1 = User already in the system //
      // 2 = Failed to add User         //
      // 3 = URL to backend is bad      //
      ////////////////////////////////////

      if (!!formCheck) {
         try {
            e.preventDefault();

            const response = await fetch(url, {
               method: "POST",
               headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
               },
               credentials: 'include',
               body: JSON.stringify({ firstName, lastName, email, password })
            })

            const data = await response.json();
            console.log(data.errorCode)
            setErrorCode(data.errorCode);
         } catch (err) {
            // Can't connect to Database
            setErrorCode(3);
         }
      }
   }

   const displayError = () => {
      let errorMessage = '';
      let errorMessageSecondary = ''
      switch (errorCode) {
         case 1:
            errorMessage = 'This email is already in use.';
            errorMessageSecondary = 'Please register with a different email.';
            break;
         case 2:
            errorMessage = 'Uh Oh, we are currently having issues.';
            errorMessageSecondary = `Please send let us know you have the following Error Code: ${errorCode}`;
            break;
         case 3:
            errorMessage = 'Oops, something happened behind the scenes,';
            errorMessageSecondary = `Please send let us know you have the following Error Code: ${errorCode}`;
            break;
         default:
            errorMessage = '';
            errorMessageSecondary = '';
      }

      return (
         <Alert className="alert alert-dismissible alert-danger users-alert">
            <strong>{errorMessage}</strong> {errorMessageSecondary}
         </Alert>
      );
   }

   return (
      <div>
         <Card className="loginSignUpContainer mt-5" >
            <Card.Header as="h5">Register</Card.Header>
            <Card.Body>
               <Form id="registerForm">
                  <Form.Group controlId="formFirstName">
                     <Form.Label>First Name</Form.Label>
                     <Form.Control type="text" name="f_name" className="form-control" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} value={firstName} required />
                  </Form.Group>
                  <Form.Group controlId="formLastName">
                     <Form.Label>Last Name</Form.Label>
                     <Form.Control type="text" name="l_name" className="form-control" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} value={lastName} required />
                  </Form.Group>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" minLength="1" name="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone.</small>
                  <Form.Group controlId="formPassword">
                     <Form.Label>Password</Form.Label>
                     <Form.Control type="password" autoComplete="on" name="password" className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                  </Form.Group>
                  <Button className="mb-3" type="submit" variant={'danger'} onClick={(e) => { createUser(e) }}>Submit</Button>
               </Form>
               {errorCode !== -1 && displayError()}
               <p className="mt-4">Already have an account? <Link to="/login"><b>Login Here</b></Link></p>
            </Card.Body>
         </Card >
         {errorCode === 0 && <Redirect to={{ pathname: '/login', errorCode }} />}
      </div>
   );
}

export default Register;