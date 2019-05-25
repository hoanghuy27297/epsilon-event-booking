import { DateTime } from '@app/shared/models/datetime.model';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { debounceTime, map } from 'rxjs/operators';
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
import { MatDialog } from '@angular/material';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';

type UpdateFields =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'userId'
  | 'gender'
  | 'position';

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
    position: ''
  };

  user: User = new User();
  user$: Observable<User>;
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
    protected db: AngularFirestore,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.buildForm();

    this.store
      .pipe(select(selectUserId))
      .subscribe(state => this.getUserDetail(state));
  }

  buildForm() {
    this.formGroup = this.fb.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      email: new FormControl({ value: this.user.email, disabled: true }, [
        Validators.required,
        Validators.email
      ]),
      userId: [
        this.user.userId,
        [Validators.required, Validators.pattern(UserRules.numberOnly)]
      ],
      gender: [this.user.gender, [Validators.required]],
      position: [this.user.position, [Validators.required]],
      role: [this.user.role, [Validators.required]]
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

  getUserDetail(id: string) {
    this.userId = id;
    this.user$ = this.db
      .collection('users')
      .doc(id)
      .valueChanges()
      .pipe(
        map(snapshot => {
          this.user = new User(snapshot);
          return new User(snapshot);
        })
      );
  }

  onOpenChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '350px'
    });
  }

  updateUserDetail() {
    this.user = this.user.fromRawValue(this.formGroup.getRawValue());

    const time = new DateTime().getDateWithFormat('HH:mm DD/MM/YYYY');
    const newHistoryAction = `You have updated your profile at ${time}`;
    const updatedHistory = [newHistoryAction, ...this.user.history];
    this.user.history = updatedHistory;

    this.db
      .doc(`users/${this.userId}`)
      .set(this.user.toJSON(), { merge: true })
      .then(() =>
        this.notificationSvc.success('You have updated your profile successfully!')
      )
      .catch(error => console.log(error));
  }
}
