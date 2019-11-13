import React, { Component } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";


class Profile extends Component {
    state = {
        date: new Date(),
        routines: []
    }

    componentDidMount() {
        this.checkForRoutines();
    }

    checkForRoutines = async () => {
        const url = "http://localhost:3000/ppl/routine"
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(this.state)
            });

            const data = await response.json();
            this.setState({ routines: data.routines })
        } catch (err) {
            console.log(err.message);
        }
    }

    onCalendarOnChangeChange = (date) => {
        this.setState({ date })
        console.log(moment(date).format("MMM DD YYYY"));
    }

    render() {

        const { routines } = this.state;
        return (
            <div>
                <Calendar
                    onChange={this.CalendarOnChange}
                    value={this.state.date}
                />
                {
                    //JSX Switch Case
                    {
                        0:
                            <div>
                                No Routine Found
                                <Link className="nav-link" to="/ppl/create_routine">
                                    <Button className="mb-3" type="submit" variant={'danger'} >Create A routine</Button>
                                </Link>
                            </div>,
                    }[this.state.routines.length] ||
                    // default
                    <div>
                        {routines.map(ele => {
                            return (
                                <p key={`routine${ele.id}`}>{ele.routine_name}</p>
                            );
                        })}
                    </div>
                }
            </div>
        );
    }
}

export default Profile;