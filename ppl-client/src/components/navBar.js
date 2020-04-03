import React, { useContext } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function NavBar() {
   const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

   const loggedInToLogout = () => {
      const url = "http://localhost:3000/users/logout";
      try {
         fetch(url, {
            method: 'GET',
            credentials: "include"
         }).then((data) => {
            setIsLoggedIn(false);
         })
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
                           </Nav.Item>
                           <Nav.Item className="nav-item active">
                              <Link className="nav-link" to="/profile">Profile</Link>
                           </Nav.Item>
                        </Nav>
                  }[isLoggedIn]
               }

            </Nav>
            {
               {
                  true:
                     <Nav className="navbar-nav ml-auto">
                        <Nav.Item className="nav-item active">
                           <Link className="nav-link" to="/" onClick={() => loggedInToLogout()}>Logout</Link>
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
               }[isLoggedIn]
            }
         </div>
      </Nav >

   );
}

export default NavBar;