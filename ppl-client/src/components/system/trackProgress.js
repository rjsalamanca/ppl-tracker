import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DisplayRoutineSelection from '../shared/DisplayRoutineSelection';
import DisplayRoutineInformation from './DisplayRoutineInformation';

function TrackProgress() {
   const [routines, setRoutines] = useState([]);
   const [fullRoutine, setFullRoutine] = useState(false);
   const [initialLoad, setInitialLoad] = useState(true);
   const [selectedRoutine, setSelectedRoutine] = useState('Select A Routine');
   const [zoomDomain, setZoomDomain] = useState({ x: [0, 1] });
   const [buildGraph1, setBuildGraph1] = useState([]);
   const [buildGraph2, setBuildGraph2] = useState([]);

   useEffect(() => {
      if (routines.length === 0) {
         checkForRoutines();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [routines]);

   useEffect(() => {
      if (!fullRoutine.routine_found && selectedRoutine !== 'Select A Routine') getFullRoutine();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [fullRoutine, setFullRoutine, selectedRoutine]);


   const handleSelect = (e) => {
      setFullRoutine({});
      setSelectedRoutine(e.target.value);
   }

   const handleZoom = (domain) => {
      setZoomDomain(domain);
   }

   const checkForRoutines = async () => {
      const url = "http://localhost:3000/ppl/routine";
      try {
         const response = await fetch(url, {
            method: "GET",
            credentials: "include"
         });

         const data = await response.json();

         if (data.routine_found === true) setRoutines(data.routines);
         setInitialLoad(false);
      } catch (err) {
         console.log(err);
      }
   }

   const getFullRoutine = async () => {
      const url = `http://localhost:3000/ppl/track/${selectedRoutine}`;
      try {
         const response = await fetch(url, {
            method: "GET",
            credentials: "include"
         });

         const data = await response.json();

         if (!!data.routine_found) {
            await setZoomDomain({ x: [moment().subtract(7, 'd'), moment()] });
            generateRoutine(data);
         } else {
            await setFullRoutine({ routine_found: false });
         }
      } catch (err) {
         console.log(err);
      }
   }

   const generateRoutine = async (data) => {
      const totalDaysSinceStart = moment().diff(data.routine.date_started, 'days');
      const lengthOfDaysInProgram = data.routine.routine_days.length;

      let totalSupposedWorkoutsSinceStart = 0;
      let tempBuildGraph1 = [];
      let tempBuildGraph2 = [];
      let dates = [];
      let filteredDates = [];
      let tempDays = [...data.routine.routine_days].map(day => {
         day['total_workouts'] = 0;
         return day;
      });

      // push all set dates to dates variable.
      data.routine.routine_days.filter(day => !day.rest_day).forEach(day => day.exercises.forEach(exercise => exercise.sets.forEach(set => dates.push(set.set_date))));
      // filter dates to only appear once.
      filteredDates = dates.filter((date, i, array) => array.indexOf(date) === i);

      // Loop through days since start of program.
      for (let i = 0; i <= totalDaysSinceStart; i++) {
         const dayIteration = i % lengthOfDaysInProgram; // Iterates amount of days in a program. Example 5 days in a program will iterate 1-5.
         let temp = filteredDates.includes(moment(data.routine.date_started).add(i, 'd').format("YYYY-MM-DD"));
         let restDay = false;

         tempDays[dayIteration].total_workouts++;

         if (!data.routine.routine_days[dayIteration].rest_day) {
            totalSupposedWorkoutsSinceStart++;
         } else {
            temp = true;
            restDay = true;
         }

         tempBuildGraph1.push({ a: new Date(moment(data.routine.date_started).add(i, 'd')), b: temp, rest: restDay });
         tempBuildGraph2.push({ key: new Date(moment(data.routine.date_started).add(i, 'd')), b: temp, rest: restDay });
      }

      tempDays.map(day => {
         day['incomplete_workouts'] = day.total_workouts - day.workouts_completed;
         return day;
      })

      data.routine.routine_days = tempDays;
      await setBuildGraph1(tempBuildGraph1);
      await setBuildGraph2(tempBuildGraph2);
      await setFullRoutine(data);
   }

   return (
      <div>
         {!initialLoad ? <DisplayRoutineSelection routines={routines} selectedRoutine={selectedRoutine} handleSelect={handleSelect} /> : ''}
         < DisplayRoutineInformation fullRoutine={fullRoutine} selectedRoutine={selectedRoutine} zoomDomain={zoomDomain} buildGraph1={buildGraph1} buildGraph2={buildGraph2} handleZoom={handleZoom} />      </div>
   );
}

export default TrackProgress;