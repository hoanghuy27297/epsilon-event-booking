import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { debounceTime } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ROUTE_ANIMATIONS_ELEMENTS } from './../../core/animations/route.animations';
import { NavigationService } from './../../core/navigation/navigation.service';
import { PositionList } from './../../shared/models/position.model';
import { UserRules } from './../../shared/validators/validators';
import { GenderList } from './../../shared/models/gender.model';
import { NotificationService, selectUserId } from '@app/core';
import { Utility } from './../../shared/helpers/utilities';
import { User } from './../../shared/models/user.model';
import { AppState } from './../../core/core.state';

type UpdateFields =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'userId'
  | 'gender'
  | 'position'

type FormErrors = { [uf in UpdateFields]: any };

@Component({
  selector: 'epsilon-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  formGroup: FormGroup;
  formErrors: FormErrors = {
    firstName: '',
    lastName: '',
    email: '',
    userId: '',
    gender: '',
    position: '',
  };

  user = new User();
  genderList = new GenderList().listGender;
  positionList = new PositionList().listPosition;
  studentId = true;
  userId = '';

  constructor(
    private fb: FormBuilder,
    private notificationSvc: NotificationService,
    private afAuth: AngularFireAuth,
    private store: Store<AppState>,
    private navigationSvc: NavigationService,
    protected db: AngularFirestore
  ) { }

  ngOnInit() {
    this.buildForm();

    this.store.pipe(select(selectUserId)).subscribe(state => this.userId = state);
  }

  buildForm() {

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

}
