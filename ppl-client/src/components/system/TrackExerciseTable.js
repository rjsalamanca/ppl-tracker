import React from 'react';
import { Table, Button } from 'react-bootstrap';

function TrackExerciseTable({ exercise, overviewExercise, overviewExerciseSets, displayOverview, displayOverviewSet }) {
   return (
      <Table>
         <thead>
            <tr>
               <th>Set #</th>
               <th>Current Weight</th>
               <th>Current Reps</th>
               <th></th>
            </tr>
         </thead>
         <tbody>
            {exercise.sets.map((set, i) =>
               set !== null ?
                  <tr key={i}>
                     <td>{set.set}</td>
                     <td>{set.weight}</td>
                     <td>{set.reps}</td>
                     <td><Button onClick={() => overviewExerciseSets(set)} aria-controls="collapse-set" aria-expanded={displayOverviewSet.show}>Expand</Button></td>
                  </tr> : 'You have not finished a set for this exercise'
            )}
            <tr>
               <td colSpan="4">
                  <Button onClick={() => overviewExercise(exercise)} aria-controls="collapse-overview" aria-expanded={displayOverview.show}>Exercise Overview</Button>
               </td>
            </tr>
         </tbody>
      </Table>
   );
}

export default TrackExerciseTable;