import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { BiChevronDownCircle } from 'react-icons/bi';

import { Container, Row, Col, Card, Collapse, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';

import TrackExerciseTable from './TrackExerciseTable';
import TrackExerciseOverview from './TrackExerciseOverview';

import './css/trackDay.css';

function TrackDay() {
   const location = useLocation();
   const [originalDay, setOriginalDay] = useState({});
   const [day, setDay] = useState({});
   const [cookies] = useCookies(['user']);
   const [redirectPage, setRedirectPage] = useState(false);
   const [loading, setLoading] = useState(true);
   const [displayOverview, setOverview] = useState({ originalSelectedExercise: {}, selectedExercise: {}, show: false, changeSelected: false });
   const [displayOverviewSet, setOverviewSet] = useState({ originalSelectedExercise: {}, show: false, changeSelected: false });
   const [onExitDisplayOverview, setOnExitOverview] = useState({ originalSelectedExercise: {}, selectedExercise: {}, show: false, changeSelected: false });
   const [onExitDisplayOverviewSet, setOnExitOverviewSet] = useState({ originalSelectedExercise: {}, show: false, changeSelected: false });

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

   const getSelectedExercise = (exercise) => day.exercises.filter(e => e.id === exercise.id)[0];

   const handleExitedCollapse = () => {
      if (!!displayOverview.changeSelected) {
         setTimeout(() => {
            setOverview({ ...onExitDisplayOverview, show: !displayOverview.show, changeSelected: false })
         }, 200);
      }
   }

   const overviewExercise = (exercise) => {
      if ((Object.keys(displayOverview.originalSelectedExercise).length === 0) ||
         (exercise === displayOverview.originalSelectedExercise && !displayOverview.show) ||
         (exercise === displayOverview.originalSelectedExercise)) {

         setOverview({ ...displayOverview, originalSelectedExercise: exercise, selectedExercise: getSelectedExercise(exercise), show: !displayOverview.show });
      } else {
         setOverview({ ...displayOverview, originalSelectedExercise: exercise, show: !displayOverview.show, changeSelected: true });
         setOnExitOverview({ ...displayOverview, originalSelectedExercise: exercise, selectedExercise: getSelectedExercise(exercise), show: !displayOverview.show, changeSelected: true });
      }
   }

   const overviewExerciseSets = (exerciseSet) => {
      console.log('overview exercise sets:', exerciseSet);
   }

   return (
      !!loading && Object.keys(originalDay).length === 0 ? <div>'loading'</div> : !!redirectPage ? <Redirect to="/" /> :
         <Container>
            <Row className="track-day-row">
               <h1>{originalDay.name}</h1>
            </Row>
            <Row className="track-day-row">
               {originalDay.exercises.map(exercise =>
                  <Col key={exercise.id}>
                     <Card>
                        <Card.Body style={{ padding: 0 }}>
                           <Card.Title>{exercise.name}</Card.Title>
                           {exercise.sets !== null ? <TrackExerciseTable exercise={exercise} overviewExercise={overviewExercise} overviewExerciseSets={overviewExerciseSets} displayOverview={displayOverview} setOverview={setOverview} /> : 'Complete a workout to see your progress'}
                        </Card.Body>
                     </Card>
                  </Col>
               )}
            </Row>
            <Row className="track-day-row">
               <div className={`drop-down-indicator ${!!displayOverview.show && 'drop-down-indicator-expanded'}`}>
                  <OverlayTrigger
                     placement={'top'}
                     overlay={
                        <Tooltip>
                           <p>
                              Toggle this collapsable area by clicking
                              the 'Exercise Overview' button located
                              in the exercise tables above.
                           </p>
                        </Tooltip>
                     }
                  >
                     <BiChevronDownCircle className={`drop-down-icon ${!!displayOverview.show && 'drop-down-icon-rotate'}`} />
                  </OverlayTrigger>
               </div>
               <Collapse className="track-exercise-overview-container" in={displayOverview.show} onExited={() => handleExitedCollapse()}>
                  <div id="example-collapse-text">
                     {(Object.keys(displayOverview.originalSelectedExercise).length !== 0) && <TrackExerciseOverview exercise={{ original: displayOverview.originalSelectedExercise, selected: displayOverview.selectedExercise }} />}
                  </div>
               </Collapse>
            </Row>
            <Row className="track-day-row">
               <div className={`drop-down-indicator ${!!displayOverviewSet.show && 'drop-down-indicator-expanded'}`}>
                  <OverlayTrigger
                     placement={'top'}
                     overlay={
                        <Tooltip>
                           <p>
                              Toggle this collapsable area by clicking
                              the 'Expand' button located in the exercise
                              tables above, to the right of each set.
                           </p>
                        </Tooltip>
                     }
                  >
                     <BiChevronDownCircle className={`drop-down-icon ${!!displayOverviewSet.show && 'drop-down-icon-rotate'}`} />
                  </OverlayTrigger>
               </div>
            </Row>
         </Container >
   )
}

export default TrackDay;