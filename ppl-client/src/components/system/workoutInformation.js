import React, { Component } from 'react';

class WorkoutInformation extends Component {
    state = { workout: {} }

    componentDidMount() {
        this.setState({ workout: this.props.selectedWorkout })
    }

    render() {
        const { workout } = this.state;
        console.log(workout);
        return (
            <div>
                {
                    Object.keys(workout).length === 0 ? <div></div> :
                        <div>
                            <h3>{workout.day_name}</h3>
                            <ol>
                                {
                                    workout.exercises.map((exercise) =>
                                        <li key={`Workout-${workout.day_name}-${exercise.exercise_name}`} className="">
                                            {exercise.exercise_name}
                                            <ul>
                                                {
                                                    exercise.sets.map((set, idx) =>
                                                        <li key={`Workout-${workout.day_name}-${exercise.exercise_name}-Set${idx}`}>
                                                            SET {idx + 1} : {set.weight}lbs x {set.reps}
                                                        </li>
                                                    )
                                                }
                                            </ul>
                                        </li>
                                    )
                                }
                            </ol>
                        </div>
                }
            </div>
        )
    }
}

export default WorkoutInformation;