import { Exercise } from './exercise.model';
import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UIService } from '../shared/ui.service';
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';
import * as UI from '../shared/ui.actions';
import * as TRAINING from './training.actions';
import { take } from 'rxjs/operators';

@Injectable()
export class TrainingService {

  private fbSubs: Subscription[] = [];
  isLoading = false;
  /**
   *
   */
  constructor(
      private db: AngularFirestore,
      private uiService: UIService,
      private store: Store<fromTraining.State>) {}
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
        this.store.dispatch(new TRAINING.SetAvailableTrainings(exercises));
      }, error => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching Exercises Failed, Please try again later', null , 3000);
    }));
  }
  getAvailableServices() {
    return this.availableExercises.slice();
  }
  startExercise(selectedId: string) {
    this.store.dispatch(new TRAINING.StartTraining(selectedId));
  }
  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed'
        });
      });
    this.store.dispatch(new TRAINING.StopTraining());
  }
  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        ...ex,
        duration: ex.duration * (progress / 100),
        caloriesBurnt: ex.caloriesBurnt * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
    });
    this.store.dispatch(new TRAINING.StopTraining());
  }

  fetchCompletedOrCancelledExercises() {
      this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new TRAINING.SetFininshedTrainnigs(exercises));
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
