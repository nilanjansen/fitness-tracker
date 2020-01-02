import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { AngularFirestore } from '@angular/fire/firestore';
import { UIService } from 'src/app/shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  private exerciseSubscription: Subscription;
  private loadingSubs: Subscription;
  availableExercises: Exercise[];
  isLoading$: Observable<boolean>;
  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<{ui: fromRoot.State}>
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
    //     isLoading => {
    //       this.isLoading = isLoading;
    // });
    this.exerciseSubscription =  this.trainingService.exercisesChanged.subscribe(
      exercises => {
        this.availableExercises = exercises;
        console.log('from Component' + this.availableExercises);
    });
    this.fetchExercises();
  }
  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
  fetchExercises() {
    this.trainingService.fetchAvailableExercise();
  }
  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    // if (this.loadingSubs) {
    //   this.loadingSubs.unsubscribe();
    // }
  }
}
