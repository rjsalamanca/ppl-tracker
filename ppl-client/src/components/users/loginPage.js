import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Card, Button, Form, Alert } from "react-bootstrap";

import { useCookies } from 'react-cookie';
import { UserContext } from '../../contexts/UserContext';
import axios from 'axios';
import '../../App.css';

function Login(props) {
   const [errorCode, setErrorCode] = useState(-1);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const [cookies, setCookie] = useCookies(['user']);
   const { loggedIn, setLoggedIn } = useContext(UserContext)

   useEffect(() => {
      if (props.location.errorCode === 0 && cookies.user.isLoggedIn === false) setErrorCode(5);
   }, [props.location.errorCode, cookies]);

   const login = async (e) => {
      const formCheck = document.getElementById('loginForm').checkValidity();
      const url = "http://localhost:3000/users/login";
      if (!!formCheck) {
         e.preventDefault();
         try {
            const response = await fetch(url, {
               method: "post",
               headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
               },
               credentials: "include",
               body: JSON.stringify({ email, password })
            })

            const data = await response.json();

            ///////////////////////////////////
            //          ERROR CODES:         //
            ///////////////////////////////////
            // 0 = Success                   //
            // 1 = No User Found             //
            // 2 = Password Incorrect        //
            // 3 = Database Error            //
            // 4 = URL to backend is bad     //
            // 5 = Redirecteed from register //
            //     - display message         //
            ///////////////////////////////////s

            if (data.errorCode === 0) {
               console.log('setting login')
               setCookie('user', { isLoggedIn: true })
               setLoggedIn(true);
               setErrorCode(0);
            } else {
               setErrorCode(data.errorCode);
            }

         } catch (err) {
            console.log(err)
            setErrorCode(4);
         }
      }
   }

   const displayError = () => {
      let errorMessage = '';
      let errorMessageSecondary = ''
      switch (errorCode) {
         case 1:
            errorMessage = 'Oops, User was not found,';
            errorMessageSecondary = 'please register.';
            break;
         case 2:
            errorMessage = 'Oops, Password was Incorrect,';
            errorMessageSecondary = 'please try again.';
            break;
         case 3:
            errorMessage = 'Oops, something happened behind the scenes,';
            errorMessageSecondary = 'please send this message to us!';
            break;
         case 4:
            errorMessage = 'Oops, something happened when we tried to find your account,';
            errorMessageSecondary = 'please send this message to us!';
            break;
         case 5:
            errorMessage = "You've successfully registered!";
            errorMessageSecondary = 'Login with your credentials';
            return (
               <Alert className="alert alert-dismissible alert-success users-alert">
                  <strong>{errorMessage}</strong> {errorMessageSecondary}
               </Alert>);
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
         <Card className="loginSignUpContainer mt-5">
            <Card.Header as="h5">Login</Card.Header>
            <Card.Body>
               <Form id="loginForm">
                  <Form.Group controlId="formBasicEmail">
                     <Form.Label>Email address</Form.Label>
                     <Form.Control type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" value={email} required />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                     <Form.Label>Password</Form.Label>
                     <Form.Control autoComplete="on" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" value={password} required />
                  </Form.Group>
                  <Button className="mb-3" type="submit" variant="primary" onClick={(e) => login(e)}>Sign In</Button>
               </Form>
               {errorCode !== -1 && displayError()}
               <p className="mt-4">
                  No Account? <Link to="/register"><b>Register</b></Link>
               </p>
            </Card.Body>
            {errorCode === 0 ? <Redirect to="/profile" /> : <div></div>}
         </Card >
      </div>
   )
}

export default Login;