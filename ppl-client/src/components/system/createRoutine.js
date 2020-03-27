import React, { Component } from 'react';
import moment from 'moment';
import { Redirect } from "react-router-dom";

import AddRoutineName from './addRoutineName';
import AddDay from './addDay';

class createRoutine extends Component {
   state = {
      redirect: false,
      error_code: 0,
      routine_name: '',
      todays_date: moment(new Date()).format("YYYY-MM-DD"),
      routine_name_check: false,

   };

   checkRoutineName = (e) => {
      if (e.target.value.length >= 3) {
         this.setState({
            routine_name: e.target.value.trim(),
            routine_name_check: true
         });
      } else {
         this.setState({ routine_name_check: false });
      }
   }

   saveRoutine = async (days) => {
      let send_info = {
         routine_name: this.state.routine_name,
         todays_date: this.state.todays_date,
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
               this.setState({ redirect: true })
            } else {
               this.setState({ error_code: data.error_code })
            }
         } catch (err) {
            // back end connection error
            this.setState({ error_code: 5 })
         }
      } else {
         // no days error
         this.setState({ error_code: 4 })
      }
   }

   displayError = () => {
      const { error_code } = this.state;
      let sendJSX = '';
      switch (error_code) {
         case 1:
            sendJSX = 'You already have a routine with the same name, try using a different name';
            break;
         case 2:
            sendJSX = 'We had a problem with adding your routine days or exercises, please send this error to us with the name of your routine days and exercises.';
            break;
         case 3:
            sendJSX = 'We had a problem with adding your routine name, please send this error to us with the name of your routine name.';
            break;
         case 4:
            sendJSX = 'It looks like you forgot to add some days to your routine.';
            break;
         case 5:
            sendJSX = 'Hmm, it looks like either our server or your connection is down.';
            break;
         default:
      }
      return (
         <div>
            ERROR: {sendJSX}
         </div>
      );
   }

   loadProperComponents = () => {
      const { routine_name_check } = this.state;
      if (!!routine_name_check) {
         return <AddDay saveRoutine={this.saveRoutine} />
      }
   }

   render() {
      const { error_code, redirect } = this.state;
      return (
         <div>
            {error_code !== 0 && this.displayError()}
            <AddRoutineName checkRoutineName={this.checkRoutineName} />
            {this.loadProperComponents()}
            {!!redirect && <Redirect to="/profile/" />}
         </div>
      );
   }
}

export default createRoutine;