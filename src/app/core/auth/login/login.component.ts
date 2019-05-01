import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'epsilon-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
