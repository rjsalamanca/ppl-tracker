import React, { Component } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";


class NavBar extends Component {
    state = {};

    render() {
        return (
            <Nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" href="#">PPL Tracker</Link>
                <Button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </Button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <Nav className="navbar-nav">
                        <Nav.Item className="nav-item active">
                            <Link className="nav-link" to='/'>Home <span className="sr-only">(current)</span></Link>
                        </Nav.Item>
                        <Nav.Item className="nav-item active">
                            <Link className="nav-link" to='/Test'>Test </Link>
                        </Nav.Item>
                        {/* <Nav.Item className="nav-item">
                  <Link className="nav-link" href="#">Features</Link>
                </Nav.Item>
                <Nav.Item className="nav-item">
                  <Link className="nav-link" href="#">Pricing</Link>
                </Nav.Item>
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dropdown link
                  </Link>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <Link className="dropdown-item" href="#">Action</Link>
                    <Link className="dropdown-item" href="#">Another action</Link>
                    <Link className="dropdown-item" href="#">Something else here</Link>
                  </div>
                </li> */}
                    </Nav>
                </div>
            </Nav>
        );
    }
}

export default NavBar;