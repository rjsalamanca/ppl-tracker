import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";

class RoutineInformation extends Component {
    state = {
        routine_info: {}
    }

    async componentDidMount() {
        await this.setState({ routine_info: this.props.routine });
        console.log(this.state.routine_info);
    }

    render() {
        const { routine_info } = this.state;
        return (
            <>
                {Object.entries(routine_info).length === 0 ? <div>LOADINGI</div> :
                    <h2>Routine: {routine_info.routine.routine_name}</h2>
                }
            </>
        );
    }
}

export default RoutineInformation;