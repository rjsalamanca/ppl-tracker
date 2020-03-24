import React, { Component } from 'react';
import moment from 'moment';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from "react-router-dom";

class createRoutine extends Component {
   state = {
      redirect: false,
      error_code: 0,
      routine_name: '',
      routine_info: {},
      todays_date: moment(new Date()).format("YYYY-MM-DD")
   };

   handleRoutine = (e) => this.setState({ error_code: 0, routine_name: e.target.value.trim() });

   createRoutine = async () => {
      const url = "http://localhost:3000/ppl/create_routine"
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

         !!data.routine_added ? this.setState({ redirect: true, routine_info: data.routine_info }) : this.setState({ redirect: false, error_code: data.error_code });
      } catch (err) {
         console.log(err.message);
      }
   }

   render() {
      console.log(this.state.routine_name)
      return (
         <div>
            create here
            <Form>
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
            }} /> : <div></div>}
         </div>
      );
   }
}

export default createRoutine;