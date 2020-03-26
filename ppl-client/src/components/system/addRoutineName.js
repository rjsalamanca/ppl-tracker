import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

class AddRoutineName extends Component {
   state = {
      routine_name: '',
   };

   handleRoutine = (e) => {
      this.setState({ routine_name: e.target.value.trim() });
      this.props.checkRoutineName(e)
   }

   render() {
      return (
         <div>
            <Form>
               <Form.Group>
                  <Form.Label>Routine Name</Form.Label>
                  <Form.Control type="input" onChange={(e) => this.handleRoutine(e)} placeholder="Ex. Push Pull Legs" />
               </Form.Group>
            </Form>
         </div>
      );
   }
}

export default AddRoutineName;