import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import { Store } from '@ngrx/store';
import * as UI from '../shared/ui.actions';


@Injectable()
export class AuthService {
  private user: User;
  authChange = new Subject<boolean>();
  private isAuthenticated = false;
  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiservice: UIService,
    private store: Store<fromRoot.State>
  ) {}
  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    // this.uiservice.loadingStateChanged.next(true);
    this.afauth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        // this.uiservice.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiservice.showSnackbar(error.message, null, 3000);
      });
  }
  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    // this.uiservice.loadingStateChanged.next(true);
    this.afauth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
          // this.uiservice.loadingStateChanged.next(false);
          this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
          // this.uiservice.loadingStateChanged.next(false);
          this.store.dispatch(new UI.StopLoading());
          this.uiservice.showSnackbar(error.message, null, 3000);
      });
  }
  logout() {
    this.afauth.auth.signOut();
  }
  getUser() {
    return { ...this.user };
  }
  isAuth() {
    return this.isAuthenticated;
  }
  initAuthListener() {
    this.afauth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscription();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }
}
