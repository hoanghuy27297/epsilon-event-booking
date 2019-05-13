import { validationMessages } from './../validators/validators';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

import { DateTime } from './../models/datetime.model';

export class Utility {
  public static onValueChanged(
    formGroup: FormGroup,
    formErrors?: any
  ) {
    if (!formGroup) {
      return;
    }
    const form = formGroup;

    for (const field in formErrors) {
      if (Object.prototype.hasOwnProperty.call(formErrors, field)) {
        // clear previous error message (if any)
        formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
                formErrors[field] += ` ${
                  (messages as { [key: string]: string })[key]
                }`;
              }
            }
          }
        }
      }
    }
  }

  public static set selectedTabIndex(tabIndex: number) {
    if (tabIndex === null) {
      localStorage.removeItem('tabIndex');
    } else {
      localStorage.setItem('tabIndex', tabIndex.toString());
    }
  }

  public static get selectedTabIndex(): number {
    if (localStorage.getItem('tabIndex')) {
      return +localStorage.getItem('tabIndex');
    }
    return 0;
  }

  public static set returnUrl(returnUrl: string | null) {
    if (returnUrl === null) {
      localStorage.removeItem('returnUrl');
    } else {
      this.returnUrl = returnUrl;
      localStorage.setItem('returnUrl', returnUrl || '/');
    }
  }

  // get expiration date
  public static getExpirationDate(expiresInDuration: number): Date {
    const now = new Date();
    return new Date(now.getTime() + expiresInDuration * 1000);
  }

  // public static setLogoutTime(time: number = 0) {
  //   if (time > 0) {
  //     if (!localStorage.getItem('logoutTime')) {
  //       const timer = new DateTime();
  //       timer.dateObject = timer.addHours(time);
  //       localStorage.setItem('logoutTime', timer.dateToString);
  //     }
  //   } else {
  //     localStorage.removeItem('logoutTime');
  //   }
  // }

  // public static getLogoutTime(): DateTime | null {
  //   if (!localStorage.getItem('logoutTime')) return null;

  //   const time = new DateTime();
  //   time.dateObject = localStorage.getItem('logoutTime');

  //   return time.dateObject;
  // }

  public static get returnUrl(): string | null {
    return localStorage.getItem('returnUrl');
  }

  public static get currentUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // public static get isParentSignup(): boolean {
  //     return Boolean(localStorage.getItem('isParentSignup'));
  // }

  // public static set isParentSignup(value: boolean) {
  //     if (!value) {
  //         localStorage.removeItem('isParentSignup');
  //     }
  //     else {
  //         localStorage.setItem('isParentSignup', String(value));
  //     }
  // }

  // // get timestamp from firestore
  // public static get timestamp() {
  //   return firebase.firestore.FieldValue.serverTimestamp();
  // }

  // get full of today: include time
  public static getToday(): Date {
    let today = moment().toDate();
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(59);
    today.setMilliseconds(999);
    return today;
  }

  public static setDueDate(dueDate: Date): Date {
    const date = moment(dueDate).toDate();
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    return date;
  }

  public static CheckFromDateGreaterToDate(
    fromDate: DateTime,
    toDate: DateTime,
    Type: moment.unitOfTime.Diff = 'day'
  ): boolean {
    const fDate = moment(fromDate.date);
    const tDate = moment(toDate.date);
    const result: number = tDate.diff(fDate, Type);
    return result < 1;
  }

  public static CheckFromDateTimeGreaterToDateTime(
    fromDate: Date,
    toDate: Date,
    Type: moment.unitOfTime.Diff = 'hour'
  ): boolean {
    let fDate = moment(fromDate);
    let tDate = moment(toDate);
    let result: number = tDate.diff(fDate, Type);
    return result < 1;
  }

  public static CheckFromDateEqualToDate(
    fromDate: Date,
    toDate: Date,
    Type: moment.unitOfTime.Diff = 'day'
  ): boolean {
    let fDate = moment(fromDate);
    let tDate = moment(toDate);
    let result: number = tDate.diff(fDate, Type);

    return result === 0;
  }

  public static customSort(fieldA: any, fieldB: any) {
    if (fieldA < fieldB) {
      return 1;
    }
    if (fieldA > fieldB) {
      return -1;
    } else {
      return 0;
    }
  }

  public static set loginedStatus(value: boolean) {
    if (!value) {
      localStorage.removeItem('loginedStatus');
    } else {
      localStorage.setItem('loginedStatus', String(value));
    }
  }

  public static get loginedStatus(): boolean {
    return Boolean(localStorage.getItem('loginedStatus'));
  }

  public static titleCaseWorld(word: any) {
    if (!word) {
      return word;
    }
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  public static lowerCaseWorld(word: any) {
    if (!word) {
      return word;
    }
    return word.toLowerCase();
  }

  public static upperCaseWorld(word: any) {
    if (!word) {
      return word;
    }
    return word.toUpperCase();
  }

  public static getRandomNumber(min: number = 0, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public static makeSeoTitle(input: string): string {
    if (input === undefined || input === '') return '';
    // Đổi chữ hoa thành chữ thường
    let slug = input.toLowerCase();

    // Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    // Xóa các ký tự đặt biệt
    slug = slug.replace(
      /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
      ''
    );
    // Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, '-');
    // Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    // Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    // Xóa các ký tự gạch ngang ở đầu và cuối
    slug = `@${slug}@`;
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');

    return slug;
  }
}
