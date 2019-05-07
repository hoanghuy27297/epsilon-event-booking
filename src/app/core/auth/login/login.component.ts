import { debounceTime } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core/animations/route.animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utility } from './../../../shared/helpers/utilities';
import { LoginFields, ILoginModel } from './../auth.models';

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

  }

}
