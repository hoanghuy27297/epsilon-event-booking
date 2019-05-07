import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core/animations/route.animations';
import { PositionList } from './../../../shared/models/position.model';
import { UserRules } from './../../../shared/validators/validators';
import { GenderList } from './../../../shared/models/gender.model';
import { Utility } from './../../../shared/helpers/utilities';
import { User } from './../../../shared/models/user.model';
import { RegisterFields } from '../register.models.';
import { debounceTime } from 'rxjs/operators';

type FormErrors = { [rf in RegisterFields]: any};
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
    confirmPassword: '',
  }

  user = new User();
  genderList = new GenderList().listGender;
  positionList = new PositionList().listPosition;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
    console.log(this.user);
  }

  buildForm() {
    const password = new FormControl(null, [Validators.required, Validators.minLength(UserRules.passwordMinLength)]);
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
        this.user.userId, [
          Validators.required,
          Validators.pattern(UserRules.numberOnly),
          Validators.maxLength(UserRules.idMaxLength)
        ]
      ],
      gender: [`${this.user.gender}`, [Validators.required]],
      postion: [`${this.user.position}`, [Validators.required]],
      role: [this.user.role, [Validators.required]],
      password: password,
      confirmPassword: confirmPassword
    });

    // this.formGroup.valueChanges
    //   .pipe( debounceTime(500) )
    //   .subscribe(values => {
    //     console.log(values);
    //     Utility.onValueChanged(this.formGroup, this.formErrors);
    //   })
  }

  onRegister() {
    
  }

}
