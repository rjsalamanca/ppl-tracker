import React from 'react'
import { Card, Col } from 'react-bootstrap';
import { VictoryPie } from 'victory';

function CardPieChart({ day, index }) {
   return (
      <Col>
         <Card style={{ width: '18rem' }}>
            <Card.Body>
               <Card.Title>{day.name}</Card.Title>
               <VictoryPie
                  data={[
                     { x: `Completed: ${day.workouts_completed}`, y: day.workouts_completed },
                     { x: `Incomplete: ${day.incomplete_workouts}`, y: day.incomplete_workouts }
                  ]}
               />
            </Card.Body>
         </Card>
      </Col>
   )
}

export default CardPieChart;
