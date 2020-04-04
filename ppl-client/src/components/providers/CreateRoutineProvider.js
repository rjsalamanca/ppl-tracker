import React, { useState, useMemo } from 'react';
import { CreateRoutineContext } from '../../contexts/CreateRoutineContext';

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
         <LoadComponent {...rest} />
      </CreateRoutineContext.Provider>
   )
}

export default CreateRoutineProvider;