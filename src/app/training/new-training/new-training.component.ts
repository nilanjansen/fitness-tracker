import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}
  availableExercises: Observable<Exercise[]>;
  ngOnInit() {
    this.availableExercises =   this.db
      .collection('availableExercise')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          const payloadData = doc.payload.doc.data();
          return {
            id: doc.payload.doc.id,
            name: payloadData.name,
            duration: payloadData.duration,
            caloriesBurnt: payloadData.calories
          };
        });
      });
    }
  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
