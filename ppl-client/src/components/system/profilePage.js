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

    componentDidMount = () => {
        console.log('profile page loaded')
        this.checkForRoutines();
    }

    checkForRoutines = async () => {
        const url = "http://localhost:3000/ppl/routine"
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    // "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });

            const data = await response.json();
            console.log(data)
            if (data.routine_found === true) {
                this.setState({ routines: data.routines });
            }
            // console.log(data)
            //data.routine_found === true ? this.setState({ routines: data.routines }) : console.log('No Found');
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
                    routines.length === 0 ?
                        <div>
                            No Routine Found
                                <Link className="nav-link" to="/ppl/create_routine">
                                <Button className="mb-3" type="submit" variant={'danger'} >Create A routine</Button>
                            </Link>
                        </div>
                        :
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