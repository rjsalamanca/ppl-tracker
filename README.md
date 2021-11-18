# PPL_Tracker

PPL is short for Push Pull Legs. This project was created to be a personal tracker for my Push Pull Legs workout cycle. As I've been working on this tracker, I've added features that turned in into a full on workout tracker. You're able to create multiple workout routines and you're able to track multiple workouts per day.

### LEGEND

***

- [x] - Completed

:small_orange_diamond: - In Progress

- [ ] - Incomplete

### Bug Fixes

***

- [x] Routine name needs to be trimmed before inputting in DB.
- [x] Creating of routine needs to happen in 1 SQL statement.
  - Bugs are created when there is no information in the child. EX: Routine with no Routine Days.
- [x] Workouts not updating when changing calendar date.
- [x] Workouts Schedule for Today not properly updating when calendar is changed.
- [x] Initial reload for 'Workouts Scheduled for Today' displays tomorrows workout.
  - Back end issue caused by using Math.ceil instead of Math.floor
  - [x] Bug is back after reworking hooks. Look at INSERT ISSUE BUG
  - [x] Bug is back after reworking with cookies.
    - Accidentally removed a useEffect hook. Added it back and it's working fine.
- [x] Select button does not change when selecting reps when creating a routine, but changes in the back end.
  - [x] Select bug is back. Need to work on ternary. FIXED - Just changed default value to 1.
  - [x] Select bug is back AGAIN, after changing hooks. Look at INSERT ISSUE BUG
- [x] Workouts before its start date should not be accessible.
  - [x] Workouts Scheduled Today before date start
  - [x] Current Routine Yesterday/Today/Tomorrow before date start
- [ ] Closing Modals is sometimes a bit too fast.
- [x] Error handling for routine weight (should be a number)
  - [x] Accepts Number
  - [x] Breaks on first value not a number
- [x] Ability to create a routine without sets
- [x] INSERT ISSUE BUG
  - [x] Bug caused by async await. Removed async and now using .then to solve issue
  - [x] Rest Days have no exercise sets, error on back end needs fixing.
  - Inserting of days are not in order. Rework of insertions need to be sequential according to the day.
- [x] Start button displaying on rest days
- [x] Error when fetching scheduled workouts for today
  - Bug was created when we had routines without days (happened during testing)
- [ ] Flash of unloaded content when we visit the profile page.
- [x] Hooks not working when working with PrivateRoute Component
  - Checking if still logged in still needs work.
  - Had to rework on providers
- [x] Errors on pages sometime
  - Might be cookie loading error?
  - Issue has to deal with logging in
- [x] Ability to go to the Login and Register page once logged in need to be removed.
  - [x] Restricted Ability to these pages
  - [x] Once we logout we can't access the login page.
    - Used hooks for a force reload.
- [x] After adding the editing feature, once we remove all days or all exercises, we're able to pass causing us to be able to save null exercises or days
  - [x] Fix addDay editing.
  - [x] Fix addExercises editing.
  
:small_orange_diamond: Login bug created with cookies.

### STYLING

***

- [ ] Landing page.
- [x] Creation of Routines
  - [x] Solved modal on top of modal with simple javascript (Possible rework with React?)
  - [x] Format the look of exercises in the 'Add A Day' modal.
  - [x] Format the look of all days in side routine creation load components.
  - [x] Place errors under the instructions.
- [ ] Edit Routines
- [x] Login Page.
- [x] Register Page.
- [ ] Transitions when loading new components.
- [x] Nav Bar when logged in and in mobile view is off.
- [ ] Rework Profile Page look
- [ ] Add a default background

### TO DO (New Features)

***

- [ ] Indicator on Workouts Schedule for Today: Completed vs Non Completed.
- [x] Rework login back end.
  - Also worked on check if logged in to retrieve data.
- [x] Rework checking if still logged in.
  - Navigation now works as it should.
  - Hooks are working throughout the site.
  - Used cookies to store user login info.
- [x] Add Rest Days when creating routine.
- [x] Remove Workouts Scheduled for Today if the date is before the created Routine Date.
- [x] Rework of componentWillReceiveProps in routineInformation.js - CHANGED life cycle methods
- [x] Editing of routine/exericses/sets when creating routine.
- [x] Ability to remove days when creating routine.
- [x] Ability to remove exercises when creating routine.
- [x] Ability to save a Rest Day
  - [x] Work + rest days not saving.
  - [x] Work + rest days not appearing on profile page.
- [x] Ability to edit routines/days/exercises after we have **SAVED**.
  - [x] Be able to edit the whole routine.
  - [x] Add Failsafe to update.
  - [x] Add Finish button.
  - [x] Work on backend UPDATE.
  - [x] Updating of select option doesn't work properly.
  - [x] Edit: Add Sets
  - [x] Edit: Add Exercises
  - [x] Edit: Add Days
  - [x] Edit: Work + rest days not appearing on edit page.
  - [x] Edit: Add Rest Days
  - [x] Edit: Delete Sets
  - [ ] Edit: Delete Exercises
  - [ ] Edit: Delete Days
  - [ ] Edit: Delete Rest Days
- [x] Rework with hooks or redux for state management.
  - We're using hooks
  - [x] Convert Profile Route and all children components.
  - [x] Convert routine creation and all children components.
    - Unintentionally added a save feature when adding routine information then switching pages with the use of hooks.
  - [x] Convert login/register routes.
- [x] Rework creating of workout through components instead of redirects
- [x] Work on failsafes for routine creation
  - [x] Fail Safe for routine name without any days
  - [x] Rework Error Codes/Refactor/Remove commented code
- [ ] Add end date for routine so we can finish
- [ ] Add an end routine button incase we wanted to end routine early
- [ ] Progress Page for our routines.
- [ ] Logout user if sessions back end on the backend isnt available.