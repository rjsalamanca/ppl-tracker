import React, { useState, useContext } from 'react';
import moment from 'moment';
import { Redirect } from "react-router-dom";

import AddRoutineName from './addRoutineName';
import AddDay from './addDay';

import { CreateRoutineContext } from '../../../contexts/CreateRoutineContext';

import '../css/createRoutineStyle.css';

function CreateRoutine() {
   const [redirect, setRedirect] = useState(false);
   const [errorCode, setErrorCode] = useState(0);
   const [date] = useState(moment(new Date()).format("YYYY-MM-DD"));
   // const [routineNameCheck, setRoutineNameCheck] = useState(false);

   const { routineName } = useContext(CreateRoutineContext);

   // state = {
   //    redirect: false,
   //    error_code: 0,
   //    routine_name: '',
   //    todays_date: moment(new Date()).format("YYYY-MM-DD"),
   //    routine_name_check: false,
   // };

   // const checkRoutineName = (e) => {
   //    if (e.target.value.length >= 3) {
   //       // this.setState({
   //       //    routine_name: e.target.value.trim(),
   //       //    routine_name_check: true
   //       // });
   //       setRoutineName(e.target.value.trim())
   //       setRoutineNameCheck(true);
   //    } else {
   //       // this.setState({ routine_name_check: false });
   //       setRoutineNameCheck(false);
   //    }
   // }

   const saveRoutine = async (days) => {
      let send_info = {
         routine_name: routineName,
         todays_date: date,
         days
      }

      const url = "http://localhost:3000/ppl/routine/add_routine";

      ////////////////////////////////////
      //           ERROR CODES:         //
      ////////////////////////////////////
      // 0: Valid                       //
      // 1: Already Created             //
      // 2: Routine Insert Failed       //
      // 3: Routine Name Insert Failed  //
      // 4: No Days In Routine          //
      // 5: Backend Connection Failed   //
      ////////////////////////////////////

      if (days.length !== 0) {
         try {
            const response = await fetch(url, {
               method: "POST",
               headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
               },
               credentials: 'include',
               body: JSON.stringify(send_info)
            });

            const data = await response.json();
            if (!!data.routine_added) {
               // this.setState({ redirect: true })
               setRedirect(true);
            } else {
               // this.setState({ error_code: data.error_code })
               setErrorCode(data.error_code)
            }
         } catch (err) {
            // back end connection error
            // this.setState({ error_code: 5 })
            setErrorCode(5)
         }
      } else {
         // no days error
         // this.setState({ error_code: 4 })
         setErrorCode(4)
      }
   }

   const displayError = () => {
      // const { error_code } = this.state;
      let errorMessage = '';

      switch (errorCode) {
         case 1:
            errorMessage = 'You already have a routine with the same name, try using a different name';
            break;
         case 2:
            errorMessage = 'We had a problem with adding your routine days or exercises, please send this error to us with the name of your routine days and exercises.';
            break;
         case 3:
            errorMessage = 'We had a problem with adding your routine name, please send this error to us with the name of your routine name.';
            break;
         case 4:
            errorMessage = 'It looks like you forgot to add some days to your routine.';
            break;
         case 5:
            errorMessage = 'Hmm, it looks like either our server or your connection is down.';
            break;
         default:
      }

      return (
         <div className="errorContainer">
            <span className="errorLabel">Oops...</span> {errorMessage}
         </div>
      );
   }

   const loadProperComponents = () => {
      // const { routine_name_check } = this.state;
      if (routineName.length >= 3) {
         return <AddDay saveRoutine={saveRoutine} />
      }
   }

   // render() {
   // const { error_code, redirect } = this.state;
   return (
      <div id="routineCreationMainContainer">
         <div className="routineCreationFlexContainer">
            <div className="routineCreationInstructions">
               <h1 className="routineHeader h4">Lets Create A Routine</h1>
               <ol className="routineInstructions">
                  <li>Start off by creaing a routine name.</li>
                  <li>You can then add days to your routine.</li>
                  <li>When you're adding days you can then add exercises.</li>
                  <li>Specify the weight for each set/rep.</li>
                  <li>Once you're done, click finish!</li>
               </ol>
               {errorCode !== 0 && displayError()}
            </div>
            <div className="routineCreationLoadComponents">
               <AddRoutineName />
               {loadProperComponents()}
            </div>
         </div>
         {!!redirect && <Redirect to="/profile/" />}
      </div >
   );
   // }
}

export default CreateRoutine;