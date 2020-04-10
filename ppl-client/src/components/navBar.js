import React, { useContext, useState, useEffect } from 'react';
import { Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, Redirect } from "react-router-dom";
import { useCookies } from 'react-cookie';

import { UserContext } from '../contexts/UserContext';

function NavBar() {
   const [cookies, setCookie] = useCookies(['user']);
   const [redirect, setRedirect] = useState(false);
   const { loggedIn, setLoggedIn, update, setUpdate } = useContext(UserContext);

   useEffect(() => {
      // console.log('update nav')
      // console.log(cookies)
      // console.log(loggedIn)
      // if (!!cookies.hasOwnProperty('user')) {
      //    !!cookies.user.isLoggedIn ? setLoggedIn(true) : setLoggedIn(false);
      // } else {
      //    setLoggedIn(false);
      // }

   }, [cookies.user, loggedIn])

   const loggedInToLogout = async (e) => {
      e.preventDefault();
      const url = "http://localhost:3000/users/logout";
      try {
         const response = await fetch(url, {
            method: 'GET',
            credentials: "include"
         })
         const data = await response.json();
         if (!data.is_logged_in) {
            // setUpdate(update + 1);
            setCookie('use r', { isLoggedIn: false })
            console.log('\n\n\n\nsetting login to false:', cookies)
            setLoggedIn(false);
         }
      } catch (err) {
      }
   }

   return (
      < Nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm" style={{ zIndex: 100 }} >
         {!!redirect && <Redirect to="/" />}
         <Link className="navbar-brand" to="/">PPL Tracker</Link>
         <Button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
         </Button>
         <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <Nav className="navbar-nav">
               <Nav.Item className="nav-item active">
                  <Link className="nav-link" to='/'>Home <span className="sr-only">(current)</span></Link>
               </Nav.Item>
               {
                  {
                     true:
                        <Nav className="navbar-nav">
                           <div className="nav-item dropdown">
                              <div className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                 Routine
                              </div>
                              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                 <NavDropdown.Item className="dropdown-item" href="/ppl/create_routine">Create Routine</NavDropdown.Item>
                                 <NavDropdown.Divider />
                                 <NavDropdown.Item className="dropdown-item" href="/ppl/edit_routines">Edit Routines</NavDropdown.Item>
                              </div>
                           </div>

                           <Nav.Item className="nav-item active">
                              <Link className="nav-link" to="/profile">Profile</Link>
                           </Nav.Item>
                        </Nav>
                  }[loggedIn]
               }
            </Nav>
            {
               {
                  true:
                     <Nav className="navbar-nav ml-auto">
                        <Nav.Item className="nav-item active">
                           <Link className="nav-link" to="/" onClick={(e) => loggedInToLogout(e)}>Logout</Link>
                        </Nav.Item>
                     </Nav>,
                  false:
                     <Nav className="navbar-nav ml-auto">
                        <Nav.Item className="nav-item active">
                           <Link className="nav-link" to="/login">Login</Link>
                        </Nav.Item>
                        <Nav.Item className="nav-item active">
                           <Link className="nav-link" to="/register">Register</Link>
                        </Nav.Item>
                     </Nav>
               }[loggedIn]
            }
         </div>
      </Nav >

   );
}

export default NavBar;