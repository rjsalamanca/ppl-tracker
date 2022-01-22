import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';

import { CreateRoutineContext } from '../../../contexts/CreateRoutineContext';

function AddRoutineName() {
   const { routineName, setRoutineName } = useContext(CreateRoutineContext);
   return (
      <div>
         <Form>
            <Form.Group>
               <Form.Control type="input" onChange={(e) => setRoutineName(e.target.value.trim())} value={routineName} placeholder="Enter a Routine Name" />
            </Form.Group>
         </Form>
      </div>
   );
}

export default AddRoutineName;