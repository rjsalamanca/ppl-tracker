import React, { Component } from 'react';
import moment from 'moment';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from "react-router-dom";

import AddRoutineName from './addRoutineName';
import AddDay from './addDay';

class createRoutine extends Component {
   state = {
      redirect: false,
      error_code: 0,
      routine_name: '',
      todays_date: moment(new Date()).format("YYYY-MM-DD"),
      routine_name_check: false,
   };

   checkRoutineName = (e) => {
      if (e.target.value.length >= 3) {
         this.setState({
            routine_name: e.target.value.trim(),
            routine_name_check: true
         });
      } else {
         this.setState({ routine_name_check: false });
      }
   }

   saveRoutine = async (days) => {
      let send_info = {
         routine_name: this.state.routine_name,
         days
      }

      const url = "http://localhost:3000/ppl/routine/add_routine";

      try {
         const response = await fetch(url, {
            method: "POST",
            headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(send_info)
         });

         const data = await response.json();
         console.log(data)

      } catch (err) {
         console.log(err.message);
      }
   }

   loadProperComponents = () => {
      const { routine_name_check } = this.state;
      if (!!routine_name_check) {
         return <AddDay saveRoutine={this.saveRoutine} />
      }
   }

   render() {
      return (
         <div>
            create here
            <AddRoutineName checkRoutineName={this.checkRoutineName} />
            {this.loadProperComponents()}
            {/* <Form>
               <Form.Group controlId="formBasicEmail">
                  <Form.Label>Routine Name</Form.Label>
                  <Form.Control type="input" onChange={(e) => this.handleRoutine(e)} placeholder="Ex. Push Pull Legs" />
               </Form.Group>

               <Button className="mb-3" variant="danger" onClick={(e) => this.createRoutine(e)}>Create</Button>
            </Form>
            {
               {
                  1: <div>ERROR ALREADY EXISTS</div>
               }[this.state.error_code]
            }
            {this.state.redirect ? <Redirect to={{
               pathname: "/ppl/routine/add_day",
               state: { routine_info: this.state.routine_info }
            }} /> : <div></div>} */}
         </div>
      );
   }
}

export default createRoutine;