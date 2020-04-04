import React, { useState, useMemo } from 'react';
import { CreateRoutineContext } from '../../contexts/CreateRoutineContext';
import CreateRoutine from '../system/routine_creation/createRoutine'
function CreateRoutineProvider({ LoadComponent, ...rest }) {
   const [routineName, setRoutineName] = useState('');
   const [routineDays, setRoutineDays] = useState([]);
   const [tempExercises, setTempExercises] = useState([]);

   const createRoutineValues = useMemo(() => (
      {
         routineName, setRoutineName,
         routineDays, setRoutineDays,
         tempExercises, setTempExercises
      }
   ),
      [
         routineName, setRoutineName,
         routineDays, setRoutineDays,
         tempExercises, setTempExercises
      ]
   );

   return (
      <CreateRoutineContext.Provider value={createRoutineValues}>
         {/* <CreateRoutine /> */}
         <LoadComponent {...rest} />
      </CreateRoutineContext.Provider>
   )
}

export default CreateRoutineProvider;