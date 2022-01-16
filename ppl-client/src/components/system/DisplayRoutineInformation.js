import React from 'react';
import moment from 'moment';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { VictoryChart, VictoryGroup, VictoryTooltip, VictoryLine, VictoryScatter, VictoryPie, VictoryAxis, VictoryBrushContainer, VictoryZoomContainer } from 'victory';



function DisplayRoutineInformation({ fullRoutine, selectedRoutine, zoomDomain, buildGraph1, buildGraph2, handleZoom }) {

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


export default DisplayRoutineInformation
