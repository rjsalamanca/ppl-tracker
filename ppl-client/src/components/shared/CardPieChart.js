import React from 'react'
import { Card, Col } from 'react-bootstrap';
import { VictoryPie } from 'victory';
import { Link } from 'react-router-dom';
import './css/sharedComponents.css'

function CardPieChart({ day }) {
   return (
      <Col>
         <Card style={{ width: '18rem' }} className="clickableCard">
            <Link className="cardLink" to={{
               pathname: '/track_progress/trackTest',
               search: `/Routine_${day.routine_id}/Day_${day.routine_day_id}`,
               state: { fromDashboard: true },
               day
            }}>

               <div className="backgroundEffect"></div>
               <Card.Body className="content">
                  <Card.Title className="h-1 mt-4 text-center">{day.name}</Card.Title>
                  <VictoryPie
                     data={[
                        { x: `Completed: ${day.workouts_completed}`, y: day.workouts_completed },
                        { x: `Incomplete: ${day.incomplete_workouts}`, y: day.incomplete_workouts }
                     ]}
                     colorScale={["#006edc", "#EEEEEE"]}
                  />
               </Card.Body>
            </Link>
         </Card>
      </Col >
   )
}

export default CardPieChart;