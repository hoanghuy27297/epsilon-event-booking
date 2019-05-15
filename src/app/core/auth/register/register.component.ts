import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomValidators } from 'ng2-validation';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { NotificationService } from './../../notifications/notification.service';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core/animations/route.animations';
import { NavigationService } from './../../navigation/navigation.service';
import { PositionList } from './../../../shared/models/position.model';
import { UserRules } from './../../../shared/validators/validators';
import { GenderList } from './../../../shared/models/gender.model';
import { Utility } from './../../../shared/helpers/utilities';
import { User } from './../../../shared/models/user.model';
import { RegisterFields } from '../register.models.';
import { ActionAuthLogin } from './../auth.actions';
import { AppState } from './../../core.state';

type FormErrors = { [rf in RegisterFields]: any };
@Component({
  selector: 'epsilon-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  formGroup: FormGroup;
  formErrors: FormErrors = {
    firstName: '',
    lastName: '',
    email: '',
    userId: '',
    gender: '',
    position: '',
    password: '',
    confirmPassword: ''
  };

  user = new User();
  genderList = new GenderList().listGender;
  positionList = new PositionList().listPosition;
  studentId = true;

  constructor(
    private fb: FormBuilder,
    private notificationSvc: NotificationService,
    private afAuth: AngularFireAuth,
    private store: Store<AppState>,
    private navigationSvc: NavigationService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    const password = new FormControl(null, [
      Validators.required,
      Validators.minLength(UserRules.passwordMinLength)
    ]);
    const confirmPassword = new FormControl(null, [
      Validators.required,
      Validators.minLength(UserRules.passwordMinLength),
      CustomValidators.equalTo(password)
    ]);

    this.formGroup = this.fb.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      userId: [
        this.user.userId,
        [Validators.required, Validators.pattern(UserRules.numberOnly)]
      ],
      gender: [this.user.gender, [Validators.required]],
      position: [this.user.position, [Validators.required]],
      role: [this.user.role, [Validators.required]],
      password: password,
      confirmPassword: confirmPassword
    });

    this.formGroup.valueChanges.pipe(debounceTime(500)).subscribe(values => {
      if (values.position === 1) {
        this.studentId = false;
      } else {
        this.studentId = true;
      }
      Utility.onValueChanged(this.formGroup, this.formErrors);
    });
  }

  onRegister() {
    this.user = this.user.fromRawValue(this.formGroup.getRawValue());
    console.log(this.user.toJSON())
    this.signUp();
  }

  signUp(): Promise<User> {
    const password = this.formGroup.get('password').value;
    return this.afAuth.auth
      .createUserWithEmailAndPassword(this.user.email, password)
      .then(result => {
        if (result.additionalUserInfo.isNewUser) {
          this.notificationSvc.success('Your account is created successfully');
          this.store.dispatch(new ActionAuthLogin());
          this.navigationSvc.toAbout();
        }
      })
      .catch(error => this.handleError(error));
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
