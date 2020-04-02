import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';

import { CreateRoutineContext } from '../../../contexts/CreateRoutineContext';

function AddRoutineName() {
   // state = {
   //    routine_name: '',
   // };
   const { setRoutineName } = useContext(CreateRoutineContext);

   // const handleRoutine = (e) => {
   //    //    this.setState({ routine_name: e.target.value.trim() });
   //    //    this.props.checkRoutineName(e)
   // }


   // const handleRoutine = (e) => {
   //    // let trimmedInput = e.target.value.trim();

   //    setRoutineName(e.target.value.trim())

   // }

   // render() {
   return (
      <div>
         <Form>
            <Form.Group>
               <Form.Control type="input" onChange={(e) => setRoutineName(e.target.value.trim())} placeholder="Enter a Routine Name" />
            </Form.Group>
         </Form>
      </div>
   );
   // }
}

export default AddRoutineName;