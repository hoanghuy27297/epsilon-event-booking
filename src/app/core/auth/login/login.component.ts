import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from './../../core.state';
import { ActionAuthLogin } from './../auth.actions';
import { Utility } from './../../../shared/helpers/utilities';
import { LoginFields, ILoginModel } from './../auth.models';
import { NavigationService } from './../../navigation/navigation.service';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core/animations/route.animations';
import { NotificationService } from '@app/core/notifications/notification.service';

type FormErrors = { [lf in LoginFields]: any};
@Component({
  selector: 'epsilon-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  formGroup: FormGroup;
  formErrors: FormErrors = {
    email: '',
    password: ''
  }

  private loginModel: ILoginModel = {
    email: '',
    password: ''
  }

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private afAuth: AngularFireAuth,
    private navigationSvc: NavigationService,
    private notificationSvc: NotificationService,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })

    this.formGroup.valueChanges
      .pipe(
          debounceTime(500),
      ).subscribe(values => {
          this.loginModel = values;
          Utility.onValueChanged(
              this.formGroup,
              this.formErrors
          );
      });
  }

  onLogin() {
    const email = this.formGroup.get('email').value;
    const password = this.formGroup.get('password').value;

    this.afAuth.auth
      .signInAndRetrieveDataWithEmailAndPassword(email, password)
      .then(result => {
        this.notificationSvc.success('Welcome back!');
        this.store.dispatch(new ActionAuthLogin());
        this.navigationSvc.toAbout();
      })
      .catch(error => this.handleError(error))
  }

  handleError(error: any) {
    console.error(error);
    const errorCode = error.code || '';
    const errorMessage = error.message || '';
    this.notificationSvc.error(errorMessage);
    if (
      errorCode === 'auth/user-not-found' ||
      errorCode === 'auth/wrong-password'
    ) {
      console.error(errorCode);
      return null;
    }
    if (errorCode === 'auth/email-already-in-use') {
      console.error(errorCode);
      return error;
    }
    if (errorCode === 'auth/requires-recent-login') {
      console.error(errorCode);
      return error;
    }

    if (errorCode === 'auth/popup-closed-by-user') {
      console.error(errorCode);
      return error;
    }

    if (errorCode === 'auth/invalid-action-code') {
      console.error(errorCode);
      return error;
    }
    return error;
  }

}
