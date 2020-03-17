import React, { Component } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

class NavBar extends Component {
   state = { check: null };

   componentDidMount = () => {
      // this.props.checkLoginStatus();
      this.setState({ check: this.props.is_logged_in })
      // console.log(this.props.is_logged_in)
   }

   render() {
      return (
         < Nav className="navbar navbar-expand-lg navbar-light bg-light" >
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
                           <Nav className="navbar-nav ml-auto">
                              <Nav.Item className="nav-item active">
                                 <Link className="nav-link" to="/ppl/create_routine">Create Routine</Link>
                              </Nav.Item>
                              <Nav.Item className="nav-item active">
                                 <Link className="nav-link" to="/profile">Profile</Link>
                              </Nav.Item>
                           </Nav>
                     }[this.props.is_logged_in]
                  }

               </Nav>
               {
                  {
                     true:
                        <Nav className="navbar-nav ml-auto">
                           <Nav.Item className="nav-item active">
                              <Link className="nav-link" to="/logout">Logout</Link>
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
                  }[this.props.is_logged_in]
               }
            </div>
         </Nav >

      );
   }
}

export default NavBar;