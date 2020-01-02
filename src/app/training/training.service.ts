import { Exercise } from './exercise.model';
import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import { Store } from '@ngrx/store';
import * as UI from '../shared/ui.actions';

@Injectable()
export class TrainingService {
  private runningExercises: Exercise;
  exerciseStarted = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private exercises: Exercise[] = [];
  private fbSubs: Subscription[] = [];
  isLoading = false;
  /**
   *
   */
  constructor(
      private db: AngularFirestore,
      private uiService: UIService,
      private store: Store<fromRoot.State>) {}
  availableExercises: Exercise[];
  fetchAvailableExercise() {
    this.store.dispatch(new UI.StartLoading());
    // this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(this.db
      .collection('availableExercise')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['name'],
            duration: doc.payload.doc.data()['duration'],
            caloriesBurnt: doc.payload.doc.data()['calories']
          };
        });
      })
      .subscribe((exercises: Exercise[]) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.availableExercises = exercises;
        console.log(this.availableExercises);
        this.exercisesChanged.next([...this.availableExercises]);
      }, error => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching Exercises Failed, Please try again later', null , 3000);
        this.exercisesChanged.next(null);
    }));
  }
  getAvailableServices() {
    return this.availableExercises.slice();
  }
  startExercise(selectedId: string) {
    this.runningExercises = this.availableExercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseStarted.next({ ...this.runningExercises });
  }
  getRunningExercise() {
    return { ...this.runningExercises };
  }
  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercises,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercises = null;
    this.exerciseStarted.next(null);
  }
  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercises,
      duration: this.runningExercises.duration * (progress / 100),
      caloriesBurnt: this.runningExercises.caloriesBurnt * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercises = null;
    this.exerciseStarted.next(null);
  }
  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
    }, error => {
        // console.log(error);
    }));
  }
  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
  cancelSubscription() {
      this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
