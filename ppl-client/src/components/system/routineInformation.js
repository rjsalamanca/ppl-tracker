import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";

class RoutineInformation extends Component {
    state = {
        routine_info: {}
    }

    async componentDidMount() {
        await this.setState({ routine_info: this.props.routine });
    }

    componentWillReceiveProps(newProps) {
        const oldProps = this.props;
        if (oldProps !== newProps) {
            this.setState({ routine_info: newProps.routine });
            console.log(newProps.routine)
        }
    }

    render() {
        const { routine_info } = this.state;
        return (
            <>
                {
                    Object.entries(routine_info).length === 0 ?
                        <div>LOADING</div> :
                        !!this.state.routine_info.routine_found ?
                            <div>
                                <h2>Routine: {routine_info.routine.routine_name}</h2>
                                {routine_info.routine.routine_days.map((day) =>
                                    <div key={`day-${day.day_name}`}>
                                        <h3>{day.day_name}</h3>
                                        Todays Routine:
                                        <ul>
                                            {day.exercises.map((exercise, idx) =>
                                                <li key={`exercise-${day.day_name}-${idx}`}>
                                                    {exercise.exercise_name}
                                                    <ul>
                                                        {exercise.sets.map((set, idx) =>
                                                            <li key={`exercise-${day.day_name}-set-${idx + 1}`}>Set {idx + 1} : {set.weight} x 10</li>
                                                        )}
                                                    </ul>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            :
                            <div>Select a Routine Above</div>
                }
            </>
        );
    }
}

export default RoutineInformation;