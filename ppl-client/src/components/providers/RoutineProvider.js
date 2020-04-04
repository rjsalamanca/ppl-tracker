import React, { useState, useMemo } from 'react';
import { RoutineContext } from '../../contexts/RoutineContext';

function CreateRoutineProvider({ LoadComponent, ...rest }) {
   const [selectedWorkout, setSelectedWorkout] = useState({});
   const [date, setDate] = useState(new Date());
   const [fullRoutine, setFullRoutine] = useState({ routine_found: false });

   const routineValues = useMemo(() => (
      {
         selectedWorkout, setSelectedWorkout,
         date, setDate,
         fullRoutine, setFullRoutine
      }
   ),
      [
         selectedWorkout, setSelectedWorkout,
         date, setDate,
         fullRoutine, setFullRoutine
      ]
   );

   return (
      <RoutineContext.Provider value={routineValues}>
         <LoadComponent {...rest} />
      </RoutineContext.Provider>
   )
}

export default CreateRoutineProvider;