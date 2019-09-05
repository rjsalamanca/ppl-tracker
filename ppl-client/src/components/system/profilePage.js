import React, { Component } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';

class Profile extends Component {
    state = {
        date: new Date(),
    }

    onChange = (date) => {
        this.setState({ date })
        console.log(moment(date).format("MMM DD YYYY"));

    }

    render() {
        return (
            <div>
                <Calendar
                    onChange={this.onChange}
                    value={this.state.date}
                />
            </div>
        );
    }
}

export default Profile;