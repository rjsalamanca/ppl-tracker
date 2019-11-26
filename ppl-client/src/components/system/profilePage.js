import React, { Component } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import { Form, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";


class Profile extends Component {
    state = {
        date: new Date(),
        routines: [],
        selectedRoutine: ''
    }

    async componentDidMount() {
        console.log('profile page loaded')
        this.checkForRoutines();
    }

    handleRoutine = async (e) => {
        if (e.target.value !== 'Select Routine') {
            await this.setState({ selectedRoutine: e.target.value });
            this.test();
        }
    }

    test = () => {
        console.log('test')
    }

    checkForRoutines = async () => {
        const url = "http://localhost:3000/ppl/routine";
        try {
            const response = await fetch(url, {
                method: "GET",
                // headers: {
                //     "Accept": "application/json",
                //     "Content-Type": "application/x-www-form-urlencoded",
                // },
                credentials: "include"
            });

            const data = await response.json();
            if (data.routine_found === true) {
                this.setState({ routines: data.routines });
            }
            console.log(data)
            //data.routine_found === true ? this.setState({ routines: data.routines }) : console.log('No Found');
        } catch (err) {
            console.log(err);
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
                            <Form>
                                <Form.Control onChange={(e) => this.handleRoutine(e)} as="select">
                                    <option>Select A Routine</option>

                                    {routines.length !== 0 ?
                                        routines.map(routine =>
                                            <option key={`routine${routine.id}`}>{routine.routine_name}</option>
                                        )
                                        :
                                        <option disabled>Loading Routines...</option>
                                    }

                                </Form.Control>
                            </Form>

                        </div>
                }

            </div>
        );
    }
}

export default Profile;