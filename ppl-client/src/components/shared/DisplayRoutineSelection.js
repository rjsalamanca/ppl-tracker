import React from 'react'
import { Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

function DisplayRoutineSelection({ routines, selectedRoutine, handleSelect }) {

   return (
      <div className="routineInformation">
         {console.log('test')}
         {
            routines.length !== 0 ?
               <Form>
                  <Form.Control onChange={e => handleSelect(e)} as="select" defaultValue={selectedRoutine}>
                     <option value="Select A Routine">Select A Routine</option>
                     {routines.map(routine =>
                        <option key={`routine${routine.id}`} value={routine.routine_name}>{routine.routine_name}</option>
                     )}
                  </Form.Control>
               </Form>
               :
               <>
                  <p>No Routines Found</p>
                  <Link className="" variant={'danger'} to="/ppl/create_routine">
                     <Button className="mb-3" type="submit" variant={'danger'} >Create A routine</Button>
                  </Link>
               </>
         }
      </div>
   )
}

export default DisplayRoutineSelection


