# PPL_Tracker

PPL is short for Push Pull Legs. This project was created to be a personal tracker for my Push Pull Legs workout cycle. As I've been working on this tracker, I've added features that turned in into a full on workout tracker. You're able to create multiple workout routines and you're able to track multiple workouts per day.

```

**************
*   LEGEND   *
**************

[X] - Completed
[IP] - In Progress
[] - Incomplete

**************
* Bug Fixes: *
**************

[X] Routine name needs to be trimmed before inputting in DB.
[X] Creating of routine needs to happen in 1 SQL statement.
   - Bugs are created when there is no information in the child. EX: Routine with no Routine Days.
[X] Workouts not updating when changing calendar date.
[X] Workouts Schedule for Today not properly updating when calendar is changed.
[X] Initial reload for 'Workouts Scheduled for Today' displays tomorrows workout.
   - Back end issue caused by using Math.ceil instead of Math.floor
   [IP] Bug is back after reworking hooks. Look at INSERT ISSUE BUG
[X] Select button does not change when selecting reps when creating a routine, but changes in the back end.
   [X] Select bug is back. Need to work on ternary. FIXED - Just changed default value to 1.
   [IP] Select bug is back AGAIN, after changing hooks. Look at INSERT ISSUE BUG
[X] Workouts before its start date should not be accessible.
   [X] Workouts Scheduled Today before date start
   [X] Current Routine Yesterday/Today/Tomorrow before date start
[] Closing Modals is sometimes a bit too fast.
[X] Error handling for routine weight (should be a number)
   [X] Accepts Number
   [X] Breaks on first value not a number
[] Ability to create a routine without sets
[IP] INSERT ISSUE BUG
   - Inserting of days are not in order. Rework of insertions need to be sequential according to the day.

************
* STYLING: *
************

[] Landing page.
[X] Creation of Routines
   [X] Solved modal on top of modal with simple javascript (Possible rework with React?)
   [X] Format the look of exercises in the 'Add A Day' modal.
   [X] Format the look of all days in side routine creation load components.
   [X] Place errors under the instructions.
[X] Login Page.
[X] Register Page.
[] Transitions when loading new components.
[X] Nav Bar when logged in and in mobile view is off.
[] Rework Profile Page look
[] Add a default background

**************************
*  TO DO (New Features): *
**************************

[] Indicator on Workouts Schedule for Today: Completed vs Non Completed.
[IP] Rework login back end.
[IP] Rework checking if still logged in.
[X] Add Rest Days when creating routine.
[X] Remove Workouts Scheduled for Today if the date is before the created Routine Date.
[X] Rework of componentWillReceiveProps in routineInformation.js - CHANGED life cycle methods
[] Editing of routine/exericses/sets.
[IP] Rework with hooks or redux for state management.
   - We're using hooks
[X] Rework creating of workout through components instead of redirects
[X] Work on failsafes for routine creation
   [X] Fail Safe for routine name without any days
   [X] Rework Error Codes/Refactor/Remove commented code
[] Add end date for routine so we can finish
[] Add an end routine button incase we wanted to end routine early
[] Progress Page for our routines
[] Ability to remove days when creating routine.
[] Ability to remove exercises when creating routine.

```