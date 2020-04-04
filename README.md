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
   [X] Bug is back after reworking hooks. Look at INSERT ISSUE BUG
   [X] Bug is back after reworking with cookies.
      - Accidentally removed a useEffect hook. Added it back and it's working fine.
[X] Select button does not change when selecting reps when creating a routine, but changes in the back end.
   [X] Select bug is back. Need to work on ternary. FIXED - Just changed default value to 1.
   [X] Select bug is back AGAIN, after changing hooks. Look at INSERT ISSUE BUG
[X] Workouts before its start date should not be accessible.
   [X] Workouts Scheduled Today before date start
   [X] Current Routine Yesterday/Today/Tomorrow before date start
[] Closing Modals is sometimes a bit too fast.
[X] Error handling for routine weight (should be a number)
   [X] Accepts Number
   [X] Breaks on first value not a number
[X] Ability to create a routine without sets
[X] INSERT ISSUE BUG
   [X] Bug caused by async await. Removed async and now using .then to solve issue
   [X] Rest Days have no exercise sets, error on back end needs fixing.
   - Inserting of days are not in order. Rework of insertions need to be sequential according to the day.
[X] Start button displaying on rest days
[X] Error when fetching scheduled workouts for today
   - Bug was created when we had routines without days (happened during testing)
[] Flash of unloaded content when we visit the profile page.
[X] Hooks not working when working with PrivateRoute Component
   - Checking if still logged in still needs work.
   - Had to rework on providers
[X] Errors on pages sometime
   - Might be cookie loading error?
   - Issue has to deal with logging in
[X] Ability to go to the Login and Register page once logged in need to be removed.
   [X] Restricted Ability to these pages
   [X] Once we logout we can't access the login page. 
      - Used hooks for a force reload

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
[X] Rework login back end.
   - Also worked on check if logged in to retrieve data.
[X] Rework checking if still logged in.
   - Navigation now works as it should.
   - Hooks are working throughout the site.
   - Used cookies to store user login info.
[X] Add Rest Days when creating routine.
[X] Remove Workouts Scheduled for Today if the date is before the created Routine Date.
[X] Rework of componentWillReceiveProps in routineInformation.js - CHANGED life cycle methods
[] Editing of routine/exericses/sets.
[X] Ability to remove days when creating routine.
[X] Ability to remove exercises when creating routine.
[X] Rework with hooks or redux for state management.
   - We're using hooks
   [X] Convert Profile Route and all children components.
   [X] Convert routine creation and all children components.
      - Unintentionally added a save feature when adding routine information then switching pages with the use of hooks.
   [X] Convert login/register routes.
[X] Rework creating of workout through components instead of redirects
[X] Work on failsafes for routine creation
   [X] Fail Safe for routine name without any days
   [X] Rework Error Codes/Refactor/Remove commented code
[] Add end date for routine so we can finish
[] Add an end routine button incase we wanted to end routine early
[] Progress Page for our routines

```