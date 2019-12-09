import React, { Component } from 'react';
import moment from 'moment';
import { Form, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import { get } from 'http';

class RoutineInformation extends Component {
    state = {
        routine_info: {},
        date_between: 0,
        todays_workout: ''
    }

    async componentDidMount() {
        await this.setState({ routine_info: this.props.routine });
    }

    async componentWillReceiveProps(newProps) {
        const oldProps = this.props;
        if (oldProps !== newProps) {
            await this.setState({ routine_info: newProps.routine });
            if (!!this.state.routine_info.routine_found) {
                let start_date = moment(this.state.routine_info.routine.date_started, "MMM-DD-YYYY");
                let current = moment(new Date(), "MMM DD YYYY");
                await this.setState({ date_between: Math.ceil(moment.duration(current.diff(start_date)).asDays()) })
                this.getTodaysWorkout();
            }
        }
    }

    getTodaysWorkout() {
        const { routine_info, date_between, todays_workout } = this.state;
        const days = routine_info.routine.routine_days;
        const curr_day_ind = (date_between % days.length) - 1;
        let curr_workout;
        curr_day_ind < 0 ? this.setState({ todays_workout: days[days.length - 1] }) : this.setState({ todays_workout: days[curr_day_ind] });
    }

    render() {
        const { routine_info, todays_workout } = this.state;
        return (
            <>
                {
                    Object.entries(routine_info).length === 0 ?
                        <div>LOADING</div> :
                        !!this.state.routine_info.routine_found ?
                            <div>
                                <h2>Routine: {routine_info.routine.routine_name}</h2>
                                Todays Routine: {todays_workout.day_name}
                                {routine_info.routine.routine_days.map((day) =>
                                    <div key={`day-${day.day_name}`}>
                                        <h3>{day.day_name}</h3>
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