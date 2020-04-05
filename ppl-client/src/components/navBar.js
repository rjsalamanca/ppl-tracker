import React, { useContext } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';

import { UserContext } from '../contexts/UserContext'

function NavBar() {
   const [cookies, setCookie] = useCookies(['user']);
   const { setUpdate } = useContext(UserContext);
   const loggedInToLogout = async (e) => {
      e.preventDefault();
      const url = "http://localhost:3000/users/logout";
      try {
         const response = await fetch(url, {
            method: 'GET',
            credentials: "include"
         })
         const data = await response.json();
         // console.log(data)
         if (!data.is_logged_in) {
            setUpdate(true);
            setCookie('user', { isLoggedIn: false })
            setUpdate(false);
         }
      } catch (err) {
         console.log('cant logout')
      }
   }

   return (
      < Nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm" style={{ zIndex: 100 }} >
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
                           <Nav.Item className="nav-item active">
                              <Link className="nav-link" to="/ppl/create_routine">Create Routine</Link>
                              <Link className="nav-link" to="/ppl/edit_routines">Edit Routine</Link>
                           </Nav.Item>
                           <Nav.Item className="nav-item active">
                              <Link className="nav-link" to="/profile">Profile</Link>
                           </Nav.Item>
                        </Nav>
                  }[cookies.user.isLoggedIn]
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
               }[cookies.user.isLoggedIn]
            }
         </div>
      </Nav >

   );
}

export default NavBar;