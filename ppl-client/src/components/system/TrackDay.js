import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import { useCookies } from 'react-cookie';

import { Container, Row, Col, Card } from 'react-bootstrap';

import TrackExerciseTable from './TrackExerciseTable';

function TrackDay() {
   const location = useLocation();
   const [originalDay, setOriginalDay] = useState({});
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
            const originalFullRoutine = cookies.original_routine.routine;
            const fullRoutine = cookies.routine;
            setOriginalDay(originalFullRoutine.routine_days.filter(day => (day.routine_id === routine) && (day.routine_day_id === routine_day))[0]);
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

   const overviewExercise = (exercise) => {
      console.log('exercise:', exercise);
   }

   const overviewExerciseSets = (exerciseSet) => {
      console.log('overview exercise sets:', exerciseSet);
   }

   return (
      !!loading && Object.keys(originalDay).length === 0 ? <div>'loading'</div> : !!redirectPage ? <Redirect to="/" /> :
         <Container>
            <Row style={{ height: 'auto' }}>
               <h1>{originalDay.name}</h1>
            </Row>
            <Row>
               {originalDay.exercises.map(exercise =>
                  <Col key={exercise.id}>
                     <Card>
                        <Card.Body style={{ padding: 0 }}>
                           <Card.Title>{exercise.name}</Card.Title>
                           {exercise.sets !== null ?
                              <TrackExerciseTable exercise={exercise} overviewExercise={overviewExercise} overviewExerciseSets={overviewExerciseSets} />
                              : 'Complete a workout to see your progress'}
                        </Card.Body>
                     </Card>
                  </Col>
               )}
            </Row>
         </Container >

   )
}

export default TrackDay;