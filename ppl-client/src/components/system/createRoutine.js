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

      ////////////////////////
      //    ERROR CODES:    //
      ////////////////////////
      // 0: Valid           //
      // 1: Already Created //
      // 2: No Data         //
      // 3: Database Error  //
      ////////////////////////

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
            this.setState({ error_code: 3 })
         }
      } else {
         this.setState({ error_code: 2 })
      }
   }

   loadProperComponents = () => {
      const { routine_name_check } = this.state;
      if (!!routine_name_check) {
         return <AddDay saveRoutine={this.saveRoutine} />
      }
   }

   render() {
      return (
         <div>
            {this.state.error_code !== 0 && <div>ERROR</div>}
            <AddRoutineName checkRoutineName={this.checkRoutineName} />
            {this.loadProperComponents()}
            {!!this.state.redirect && <Redirect to="/profile/" />}
         </div>
      );
   }
}

export default createRoutine;