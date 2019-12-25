import { Exercise } from './exercise.model';
import { Subject } from 'rxjs';

export class TrainingService {
    private runningExercises: Exercise;
    exerciseStarted = new Subject<Exercise>();
    private exercises: Exercise[] = [];
    availableExercises: Exercise[] = [
        { id: 'crunches', name: 'Crunches', duration: 30, caloriesBurnt: 8 },
        { id: 'touch-toes', name: 'Touch Toes', duration: 180, caloriesBurnt: 15 },
        { id: 'side-lunges', name: 'Side Lunges', duration: 120, caloriesBurnt: 18 },
        { id: 'burpees', name: 'Burpees', duration: 60, caloriesBurnt: 8 }
    ];
    getAvailableServices() {
        return this.availableExercises.slice();
    }
    startExercise(selectedId: string) {
        this.runningExercises = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseStarted.next({...this.runningExercises});
    }
    getRunningExercise() {
        return {...this.runningExercises };
    }
    completeExercise() {
        this.exercises.push(
            {...this.runningExercises
            , date: new Date()
            , state: 'completed'});
        this.runningExercises = null;
        this.exerciseStarted.next(null);
    }
    cancelExercise(progress: number) {
        this.exercises.push(
            {...this.runningExercises
            , duration: this.runningExercises.duration * (progress / 100)
            , caloriesBurnt: this.runningExercises.caloriesBurnt * (progress / 100)
            , date: new Date()
            , state: 'cancelled'});
        this.runningExercises = null;
        this.exerciseStarted.next(null);
    }
    getCompletedOrCancelledExercises() {
        return this.exercises.slice();
      }

}
