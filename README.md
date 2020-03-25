# PPL_Tracker

PPL is short for Push Pull Legs. This project was created to be a personal tracker for my Push Pull Legs workout cycle. As I've been working on this tracker, I've added features that turned in into a full on workout tracker. You're able to create multiple workout routines and you're able to do multiple workouts per day.

```

**************
* Bug Fixes: *
**************

[X] Routine name needs to be trimmed before inputting in DB.
[] Creating of routine needs to happen in 1 SQL statement.
   - Bugs are created when there is no information in the child. EX: Routine with no Routine Days.
[X] Workouts not updating when changing calendar date.
[X] Workouts Schedule for Today not properly updating when calendar is changed.
[X] Initial reload for 'Workouts Scheduled for Today' displays tomorrows workout. (Back end issue)

************
* STYLING: *
************

[] Landing page.
[] Creation of Routines.
[] Login Page.
[] Register Page.
[] Transitions when loading new components.
[X] Nav Bar when logged in and in mobile view is off.

**************************
*  TO DO (New Features): *
**************************

[] Indicator on Workouts Schedule for Today: Completed vs Non Completed.
[] Rework login back end.
[] Rework checking if still logged in.
[] Add Rest Days when creating routine.
[] Remove Workouts Scheduled for Today if the date is before the created Routine Date.
[X] Rework of componentWillReceiveProps in routineInformation.js - CHANGED life cycle methods
[] Edit routine/exericses/sets.
[] Rework with hooks or redux for state management.

```