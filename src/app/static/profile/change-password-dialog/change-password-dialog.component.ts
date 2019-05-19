import { NotificationService } from '@app/core/notifications/notification.service';
import { Utility } from './../../../shared/helpers/utilities';
import { UserRules } from './../../../shared/validators/validators';
import { AngularFireAuth } from '@angular/fire/auth';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import * as firebase from 'firebase';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { debounceTime } from 'rxjs/operators';

type ChangePasswordFields = 'password' | 'confirmPassword';

type FormErrors = { [cpf in ChangePasswordFields]: any };

@Component({
  selector: 'epsilon-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordDialogComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  formGroup: FormGroup;
  formErrors: FormErrors = {
    password: '',
    confirmPassword: ''
  };

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationSvc: NotificationService,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>
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
      password,
      confirmPassword
    });

    this.formGroup.valueChanges.pipe(debounceTime(500)).subscribe(values => {
      Utility.onValueChanged(this.formGroup, this.formErrors);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChangePassword() {
    const password = this.formGroup.get('password').value;
    const user = this.afAuth.auth.currentUser;

    user
      .updatePassword(password)
      .then(() => {
        this.notificationSvc.success('You have updated your password successfully!');
        this.dialogRef.close();
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
