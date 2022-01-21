import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import { useCookies } from 'react-cookie';

import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';

function TrackDay() {
   const location = useLocation();
   const [day, setDay] = useState({});
   const [cookies] = useCookies(['user']);
   const [redirectPage, setRedirectPage] = useState(false);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // if page refresh, we need to get day information fr
      if (!cookies.hasOwnProperty('routine')) {
         getDay();
      } else {
         try {
            const routine = parseInt(location.search.match(/routine_(\d+)/i)[1]);
            const routine_day = parseInt(location.search.match(/day_(\d+)/i)[1]);
            const fullRoutine = cookies.routine;
            setDay(fullRoutine.routine_days.filter(day => (day.routine_id === routine) && (day.routine_day_id === routine_day))[0]);
            setLoading(false);
         } catch (e) {
            console.log(e)
            setRedirectPage(true);
         }
      }
   }, [])

   const getDay = () => {
      console.log('Need to call api to get info')
   }

   return (

      !!loading && Object.keys(day).length === 0 ? <div>'loading'</div> : !!redirectPage ? <Redirect to="/" /> :
         <Container>
            <Row>
               <Col>
                  <h1>{day.name}</h1>
               </Col>
            </Row>
            <Row>

               {day.exercises.map(exercise =>
                  <Card key={exercise.id} style={{ width: '18rem' }}>
                     <Card.Body>
                        <Card.Title>{exercise.name}</Card.Title>
                        {exercise.sets !== null ?
                           <Table>
                              <thead>
                                 <tr>
                                    <th>Set #</th>
                                    <th>Exercise Name</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {exercise.sets.map((set, i) =>
                                    set !== null ?
                                       <tr key={i}>
                                          <td>{set.id}</td>
                                       </tr> : 'You have not finished a set for this exercise'
                                 )}
                              </tbody>
                           </Table>
                           : 'Complete a workout to see your progress'}
                        < Button variant="primary">Go somewhere</Button>
                     </Card.Body>
                  </Card>

               )}
            </Row>
         </Container >

   )
}

export default TrackDay;