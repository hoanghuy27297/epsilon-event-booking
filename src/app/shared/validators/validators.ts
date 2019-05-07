export class UserRules {
    public static minLength = 2;
    public static maxLength = 40;
    public static userNamePattern = '[a-zA-Z]+';
    public static userNameMinLength = 3;
    public static userNameMaxLength = 40;
    public static displayNameMinLength = 2;
    public static displayNameMaxLength = 30;
    public static firstNameMinLength = 2;
    public static firstNameMaxLength = 30;
    public static titleNameMinLength = 2;
    public static titleNameMaxLength = 30;
    public static jobTitleMinLength = 2;
    public static jobTitleMaxLength = 30;
    public static lastNameMinLength = 2;
    public static lastNameMaxLength = 50;
    public static passwordPattern =
      '^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9_@./#&+-]+).{5,}$';
    public static passwordMinLength = 6;
    public static passwordMaxLength = 40;
    public static phoneMinLength = 6;
    public static phoneMaxLength = 16;
    public static phoneMask = [
      '(',
      /[1-9]/,
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/
    ];
    public static postCodeMask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
    public static postCodeMaxLength = 10;
    public static addressMaxLength = 150;
    public static addressMinLength = 10;
    public static ccvMaxLength = 3;
    public static numberOnly = '^[0-9]$';
    public static idMaxLength = 10;
  }
  
  export const validationMessages = {
    email: {
      required: 'Email is required',
      email: 'Email must be a valid email',
      emailExisted: 'Email existed'
    },
    uuid: {
      uuid: 'Email existed'
    },
    userName: {
      required: 'User Name is required',
      pattern: 'Please enter a valid User Name',
      minlength: `User Name must be at least ${
        UserRules.userNameMinLength
      } characters long.`,
      maxlength: `User Name cannot be more than ${
        UserRules.userNameMaxLength
      } characters long.`
    },
    displayName: {
      required: 'Display Name is required',
      minlength: `Display Name must be at least ${
        UserRules.displayNameMinLength
      } characters long.`,
      maxlength: `Display Name cannot be more than ${
        UserRules.displayNameMaxLength
      } characters long.`
    },
    firstName: {
      required: 'First Name is required',
      minlength: `First Name must be at least ${
        UserRules.firstNameMinLength
      } characters long.`,
      maxlength: `First Name cannot be more than ${
        UserRules.firstNameMaxLength
      } characters long.`
    },
    lastName: {
      required: 'Last Name is required',
      minlength: `Last Name must be at least ${
        UserRules.lastNameMinLength
      } characters long.`,
      maxlength: `Last Name cannot be more than ${
        UserRules.lastNameMaxLength
      } characters long.`
    },
    birthday: {
      required: 'Date of birth is required',
      date: 'Invalid date',
      maxDate: 'Date of birth cannot greater than today'
    },
    gender: {
      required: 'Gender is required'
    },
    password: {
      required: 'Password is required',
      pattern: 'Password must be include 6 characters, one letter and one number',
      minlength: `Password must be at least ${
        UserRules.passwordMinLength
      } characters long.`,
      maxlength: `Password cannot be more than ${
        UserRules.passwordMaxLength
      } characters long.`
    },
    confirmPassword: {
      required: 'Confirm password is required',
      pattern: 'Confirm password must be include at one letter and one number',
      minlength: `Confirm password must be at least ${
        UserRules.passwordMinLength
      } characters long.`,
      maxlength: `Confirm password cannot be more than ${
        UserRules.passwordMaxLength
      } characters long.`,
      equalTo: 'Confirm password mismatch'
    },
    telephone: {
      required: 'Phone number is required',
      minlength: `Phone number must be at least ${
        UserRules.phoneMinLength
      } characters long.`,
      maxlength: `Phone number cannot be more than ${
        UserRules.phoneMinLength
      } characters long.`,
      number: 'Phone number is incorrect'
    },
    mobilePhone: {
      minlength: `Phone number must be at least ${
        UserRules.phoneMinLength
      } characters long.`,
      maxlength: `Phone number cannot be more than ${
        UserRules.phoneMinLength
      } characters long.`,
      number: 'Phone number is incorrect'
    },
    status: {
      required: 'Status is required'
    },
    agreeTerms: {
      required: 'You must agree with our Terms and payment conditions',
      requiredTrue: 'You must agree with our Terms and payment conditions'
    },
    selectedPlan: {
      required: 'You must select a plan'
    },
    creditCard: {
      required: 'Card number is required',
      number: 'Credit card number is not correct'
    },
    expireDate: {
      required: 'Card number is required'
    },
    ccv: {
      maxlength: `Verifycation|CCV code cannot be more than ${
        UserRules.ccvMaxLength
      } characters long.`
    },
    userId: {
      required: 'Your id is required',
      pattern: 'Your id must contain number only',
      maxLength: `Id number cannot be more than 10 characters.`
    }
  };
  