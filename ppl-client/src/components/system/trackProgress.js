import React, { useState, useContext, useEffect } from 'react';
import { Card, Col, Container, Form, Button, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import moment from 'moment';
import { VictoryChart, VictoryLine, VictoryScatter } from 'victory';

function TrackProgress() {
   const [routines, setRoutines] = useState([]);
   const [fullRoutine, setFullRoutine] = useState(false)
   const [initialLoad, setInitialLoad] = useState(true);
   const [selectedRoutine, setSelectedRoutine] = useState('Select A Routine');

   useEffect(() => {
      if (routines.length === 0) checkForRoutines();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [routines]);

   useEffect(() => {
      console.log(fullRoutine);
      // console.log(selectedRoutine);
      if (!fullRoutine.routine_found && selectedRoutine !== 'Select A Routine') getFullRoutine();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [fullRoutine, setFullRoutine, selectedRoutine]);


   const handleSelect = (e) => {
      setFullRoutine({})
      setSelectedRoutine(e.target.value);
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
            await setFullRoutine(data)
         } else {
            await setFullRoutine({ routine_found: false });
         }
      } catch (err) {
         console.log(err);
      }
   }

   const displayRoutineSelection = () => {
      if (!initialLoad) {
         if (routines.length !== 0) {
            return (
               <div className="routineInformation">
                  <Form>
                     <Form.Control onChange={e => handleSelect(e)} as="select" defaultValue={selectedRoutine}>
                        <option value="Select A Routine">Select A Routine</option>
                        {routines.map(routine =>
                           <option key={`routine${routine.id}`} value={routine.routine_name}>{routine.routine_name}</option>
                        )}
                     </Form.Control>
                  </Form>
               </div>
            );
         } else {
            return (
               <div>
                  <p>No Routines Found</p>
                  <Link className="" variant={'danger'} to="/ppl/create_routine">
                     <Button className="mb-3" type="submit" variant={'danger'} >Create A routine</Button>
                  </Link>
               </div>
            );
         }
      } else {
         return <div></div>
      }
   }

   const displayRoutineInformation = () => {

      if (!!fullRoutine.routine_found) {
         const totalDaysSinceStart = moment().diff(fullRoutine.routine.date_started, 'days');
         const workoutsCompleted = fullRoutine.routine.routine_days.filter(day => !day.rest_day).reduce((a, b) => a.workouts_completed + b.workouts_completed);

         let totalSupposedWorkoutsSinceStart = 0;
         let workoutAttendence = 0;
         let buildGraph = [];
         let buildLabels = [];
         let dates = [];
         let filteredDates = [];

         // push all set dates to dates variable.
         fullRoutine.routine.routine_days.filter(day => !day.rest_day).forEach(day => day.exercises.forEach(exercise => exercise.sets.forEach(set => dates.push(set.set_date))));
         // filter dates to only appear once.
         filteredDates = dates.filter((date, i, array) => array.indexOf(date) === i);

         for (let i = 0; i <= totalDaysSinceStart; i++) {
            let temp = filteredDates.includes(moment(fullRoutine.routine.date_started).add(i, 'd').format("YYYY-MM-DD"));
            let restLabel = '';
            let rest_day = false;

            console.log(fullRoutine.routine.routine_days[i % 3])
            if (!fullRoutine.routine.routine_days[i % 3].rest_day) {
               totalSupposedWorkoutsSinceStart++;
            } else {
               restLabel = 'Rest Day';
               rest_day = true;
            }

            buildGraph.push({ x: new Date(moment(fullRoutine.routine.date_started).add(i, 'd')), y: temp, rest: rest_day });
            buildLabels.push(restLabel);
         }

         workoutAttendence = ((workoutsCompleted / totalSupposedWorkoutsSinceStart) * 100).toFixed(2);
         console.log(buildGraph)
         return (
            <Container className='trackedRoutineInfoContainer'>
               <h2>{selectedRoutine}</h2>
               <h5>{moment().format("MMM Do YYYY")}</h5>
               <Row>
                  <Col>
                     <Card style={{ width: '18rem' }}>
                        <Card.Body>
                           <Card.Title>Workouts Completed</Card.Title>
                           <Card.Text>
                              {workoutsCompleted}
                           </Card.Text>
                        </Card.Body>
                     </Card>
                  </Col>
                  <Col>
                     <Card style={{ width: '18rem' }}>
                        <Card.Body>
                           <Card.Title>Workouts Not Completed</Card.Title>
                           <Card.Text>
                              {totalSupposedWorkoutsSinceStart}
                           </Card.Text>
                        </Card.Body>
                     </Card>
                  </Col>
                  <Col>
                     <Card style={{ width: '18rem' }}>
                        <Card.Body>
                           <Card.Title>Attendence</Card.Title>
                           <Card.Text>
                              {workoutAttendence}%
                           </Card.Text>
                        </Card.Body>
                     </Card>
                  </Col>
               </Row>
               <Row>
                  <VictoryChart>
                     <VictoryScatter
                        style={{
                           data: {
                              fill: ({ datum }) => datum.rest === false ? "#000000" : "#FFA500",
                              stroke: ({ datum }) => datum.rest === false ? "#000000" : "#FFA500",
                           }
                        }}
                        data={buildGraph}
                     />
                  </VictoryChart>
               </Row>
            </Container >
         );
      } else {
         return (
            <Container className='trackedRoutineInfoContainer'>
               No Results Found
            </Container>
         )
      }
   }

   return (
      <div>
         {displayRoutineSelection()}
         {displayRoutineInformation()}
      </div>
   );
}

export default TrackProgress;