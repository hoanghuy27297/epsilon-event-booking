import { User } from '@app/shared/models/user.model';
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NotificationService, AppState, ROUTE_ANIMATIONS_ELEMENTS, selectUserId } from '@app/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store, select } from '@ngrx/store';
import { UserRules } from '@app/shared/validators/validators';
import { CustomValidators } from 'ng2-validation';
import { debounceTime } from 'rxjs/operators';
import { Utility } from '@app/shared/helpers/utilities';
import { GenderList } from '@app/shared/models/gender.model';
import { PositionList } from '@app/shared/models/position.model';
import { RoleList } from '@app/shared/models/role.model';
import { Observable, of } from 'rxjs';

type AccountField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'userId'
  | 'gender'
  | 'position'
  | 'role'
  | 'password'
  | 'confirmPassword';

type FormErrors = { [af in AccountField]: any };

@Component({
  selector: 'epsilon-manage-user-dialog',
  templateUrl: './manage-user-dialog.component.html',
  styleUrls: ['./manage-user-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageUserDialogComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  formGroup: FormGroup;
  formErrors: FormErrors = {
    firstName: '',
    lastName: '',
    email: '',
    userId: '',
    gender: '',
    position: '',
    role: '',
    password: '',
    confirmPassword: ''
  };
  userId: string;
  user: User = new User();

  genderList = new GenderList().listGender;
  positionList = new PositionList().listPosition;
  roleList = new RoleList().listRole;
  studentId$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationSvc: NotificationService,
    public dialogRef: MatDialogRef<ManageUserDialogComponent>,
    private db: AngularFirestore,
    private store: Store<AppState>
  ) {
    this.store
      .pipe(select(selectUserId))
      .subscribe(state => (this.userId = state));

    // get user
    this.db
      .doc(`users/${this.userId}`)
      .valueChanges()
      .subscribe(result => {
        this.user = new User(result, this.userId);
      });

    console.log(data);
  }

  ngOnInit() {
    this.user = new User(this.data.data, this.data.data.id);

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
      email: [{ value: this.user.email, disabled: this.data.type === 'edit' }, [Validators.required, Validators.email]],
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
        this.studentId$ = of(false);
      } else {
        this.studentId$ = of(true);
      }
      Utility.onValueChanged(this.formGroup, this.formErrors);
    });
  }

  onCreateAccount() {

  }

  onDeleteAccount() {
    this.db.doc(`users/${this.user.id}`).delete();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
