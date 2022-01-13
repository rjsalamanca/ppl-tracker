import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Form, Button, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import moment from 'moment';
import { VictoryChart, VictoryGroup, VictoryTooltip, VictoryLine, VictoryScatter, VictoryArea, VictoryAxis, VictoryBrushContainer, VictoryZoomContainer } from 'victory';

function TrackProgress() {
   const [routines, setRoutines] = useState([]);
   const [fullRoutine, setFullRoutine] = useState(false);
   const [initialLoad, setInitialLoad] = useState(true);
   const [selectedRoutine, setSelectedRoutine] = useState('Select A Routine');
   const [zoomDomain, setZoomDomain] = useState({ x: [0, 1] });

   useEffect(() => {
      if (routines.length === 0) checkForRoutines();
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

            await setFullRoutine(data);

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
         let buildGraph1 = [];
         let buildGraph2 = [];
         let dates = [];
         let filteredDates = [];

         // push all set dates to dates variable.
         fullRoutine.routine.routine_days.filter(day => !day.rest_day).forEach(day => day.exercises.forEach(exercise => exercise.sets.forEach(set => dates.push(set.set_date))));
         // filter dates to only appear once.
         filteredDates = dates.filter((date, i, array) => array.indexOf(date) === i);

         for (let i = 0; i <= totalDaysSinceStart; i++) {
            let temp = filteredDates.includes(moment(fullRoutine.routine.date_started).add(i, 'd').format("YYYY-MM-DD"));
            let rest_day = false;

            if (!fullRoutine.routine.routine_days[i % 3].rest_day) {
               totalSupposedWorkoutsSinceStart++;
            } else {
               temp = true;
               rest_day = true;
            }
            buildGraph1.push({ a: new Date(moment(fullRoutine.routine.date_started).add(i, 'd')), b: temp, rest: rest_day });
            buildGraph2.push({ key: new Date(moment(fullRoutine.routine.date_started).add(i, 'd')), b: temp, rest: rest_day });
         }

         workoutAttendence = ((workoutsCompleted / totalSupposedWorkoutsSinceStart) * 100).toFixed(2);
         console.log(fullRoutine);
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
         {displayRoutineSelection()}
         {displayRoutineInformation()}
      </div>
   );
}

export default TrackProgress;