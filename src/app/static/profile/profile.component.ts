import { Utility } from './../../shared/helpers/utilities';
import { ROUTE_ANIMATIONS_ELEMENTS } from './../../core/animations/route.animations';
import { PositionList } from './../../shared/models/position.model';
import { GenderList } from './../../shared/models/gender.model';
import { User } from './../../shared/models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavigationService } from './../../core/navigation/navigation.service';
import { AppState } from './../../core/core.state';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotificationService } from '@app/core';
import { UserRules } from './../../shared/validators/validators';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

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
