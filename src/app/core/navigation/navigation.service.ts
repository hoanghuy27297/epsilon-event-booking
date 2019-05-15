import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private route: Router) { }

  toLogin = () => {
    this.route.navigateByUrl('/login');
  }

  toRegister = () => {
    this.route.navigateByUrl('/register');
  }

  toAbout = () => {
    this.route.navigateByUrl('about');
  }

  toProfile = () => {
    this.route.navigateByUrl('profile');
  }
}
