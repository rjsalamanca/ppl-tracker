import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

class Logout extends Component {
    componentDidMount() {
        this.loggedInToLogout();
    }

    loggedInToLogout = () => {
        const url = "http://localhost:3000/users/logout";
        try {
            fetch(url, {
                method: 'GET',
                credentials: "include"
            }).then((data) => {
                console.log(data)
                this.props.changeToLogout();
            })

        } catch (err) {
            console.log('cant logout')
        }
    }

    render() {
        return (
            <Redirect to="/" />
        )
    }
}

export default Logout;