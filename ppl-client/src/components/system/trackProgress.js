import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Form, Button, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import moment from 'moment';
import { VictoryChart, VictoryGroup, VictoryTooltip, VictoryLine, VictoryScatter, VictoryPie, VictoryAxis, VictoryBrushContainer, VictoryZoomContainer } from 'victory';
import DisplayRoutineSelection from '../shared/DisplayRoutineSelection';

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
      console.log(e)
      setFullRoutine({});
      setSelectedRoutine(e.target.value);
   }

   const handleZoom = (domain) => {
      setZoomDomain(domain);
   }

   const getData = (percent) => [{ x: 1, y: percent }, { x: 2, y: 100 - percent }];

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

   const displayRoutineInformation = () => {

      if (!!fullRoutine.routine_found) {
         const totalDaysSinceStart = moment().diff(fullRoutine.routine.date_started, 'days');
         const workoutsCompleted = fullRoutine.routine.routine_days.filter(day => !day.rest_day).reduce((a, b) => a.workouts_completed + b.workouts_completed);

         let totalSupposedWorkoutsSinceStart = 0;
         let workoutAttendence = 0;

         workoutAttendence = ((workoutsCompleted / totalSupposedWorkoutsSinceStart) * 100).toFixed(2);

         return (
            <Container className='trackedRoutineInfoContainer'>
               <h2>{selectedRoutine}</h2>
               <h5>{moment().format("MMM Do YYYY")}</h5>
               <h6>Day - {totalDaysSinceStart}</h6>
               <hr />
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
                  <VictoryChart
                     domainPadding={{ y: [20, 20], x: [20, 20] }}
                     padding={{ top: 50, bottom: 50, left: 50, right: 50 }}
                     width={600}
                     height={250}
                     scale={{ x: "time" }}
                     containerComponent={
                        <VictoryZoomContainer
                           zoomDimension="x"
                           zoomDomain={zoomDomain}
                           onZoomDomainChange={handleZoom.bind(this)}
                        />
                     }
                  >
                     <VictoryAxis tickFormat={(x) => moment(x).format('MMM DD, YY')} />
                     <VictoryAxis
                        dependentAxis
                        style={{
                           axis: { stroke: 0 },
                           axisLabel: { fontSize: 10, padding: 20 },
                        }}
                        tickFormat={b => ''}
                        label='Completed Workouts'
                     />

                     <VictoryGroup color="#c43a31">
                        <VictoryLine
                           data={buildGraph1}
                           x="a"
                           y="b"
                        />
                        <VictoryScatter
                           labels={({ datum }) => `${!!datum.rest ? 'Rest Day\n' : ''} \nDate: ${moment(datum.a).format('MMM DD YYYY')}\n`}
                           labelComponent={
                              <VictoryTooltip
                                 style={{ fontSize: 10 }}
                              />
                           }
                           data={buildGraph1}
                           x="a"
                           y="b"
                        />
                     </VictoryGroup>
                  </VictoryChart>
                  <VictoryChart
                     domainPadding={{ y: [5, 5] }}
                     padding={{ top: 0, bottom: 30, left: 50, right: 50 }}
                     width={600}
                     height={50}
                     scale={{ x: "time" }}
                     containerComponent={
                        <VictoryBrushContainer
                           brushDimension="x"
                           brushDomain={zoomDomain}
                           onBrushDomainChange={handleZoom.bind(this)}
                        />
                     }
                  >
                     <VictoryAxis tickFormat={(x) => moment(x).format('MMM DD, YY')} />

                     <VictoryGroup color="#c43a31" >
                        <VictoryLine
                           data={buildGraph2}
                           x="key"
                           y="b"
                        />
                        <VictoryScatter
                           style={{ data: { strokeWidth: 0.5 } }}
                           size={2}
                           data={buildGraph2}
                           x="key"
                           y="b"
                        />
                     </VictoryGroup>
                  </VictoryChart>
               </Row>
               <Row>
                  {fullRoutine.routine.routine_days.filter(day => !day.rest_day).map(day =>
                     <Col>
                        <Card style={{ width: '18rem' }}>
                           <Card.Body>
                              <Card.Title>{day.name}</Card.Title>
                              <Card.Text>

                                 <VictoryPie
                                    data={[
                                       { x: `Completed: ${day.workouts_completed}`, y: day.workouts_completed },
                                       { x: `Incomplete: ${day.incomplete_workouts}`, y: day.incomplete_workouts }
                                    ]}
                                 />
                              </Card.Text>
                           </Card.Body>
                        </Card>
                     </Col>
                  )}
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
         {!initialLoad ? <DisplayRoutineSelection routines={routines} selectedRoutine={selectedRoutine} handleSelect={handleSelect} /> : ''}
         {displayRoutineInformation()}
      </div>
   );
}

export default TrackProgress;