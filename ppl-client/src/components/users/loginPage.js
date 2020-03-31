import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { Card, Button, Form, Alert } from "react-bootstrap";

import { UserContext } from '../../UserContext';

import '../../App.css';

function Login(props) {
   const [errorCode, setErrorCode] = useState(-1);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

   useEffect(() => {
      console.log(props.location.errorCode);
      if (props.location.errorCode === 0 && isLoggedIn === false) setErrorCode(5);
   });
   // state = {
   //    errorCode: -1,
   //    email: '',
   //    password: ''
   // }

   // componentDidMount() {
   //    (this.props.location.errorCode === 0) ? this.setState({ errorCode: 5 }) : this.setState({ errorCode: -1 });
   // }

   // const handleEmail = (e) => { this.setState({ email: e.target.value }) }
   // const handlePassword = (e) => { this.setState({ password: e.target.value }) }

   const login = async (e) => {
      const formCheck = document.getElementById('loginForm').checkValidity();
      const url = "http://localhost:3000/users/login";

      if (!!formCheck) {
         e.preventDefault();
         try {
            const response = await fetch(url, {
               method: "POST",
               headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
               },
               credentials: "include",
               body: JSON.stringify({ email, password })
            })

            const data = await response.json();
            // await this.props.checkLoginStatus()
            if (data.errorCode === 0) {
               setIsLoggedIn(true);
            }
            setErrorCode(data.errorCode);
            console.log(errorCode)

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
            ///////////////////////////////////

         } catch (err) {
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
            errorMessage = 'Oops, something happened when we tried to find our account,';
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