import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { routeAnimations, selectAuth } from '@app/core';
import { State as BaseSettingsState } from '@app/settings';

import { State as BaseExamplesState } from '../examples.state';

interface State extends BaseSettingsState, BaseExamplesState {}

@Component({
  selector: 'epsilon-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  examples = [
    { link: 'todos', label: 'epsilon.examples.menu.todos' },
    { link: 'stock-market', label: 'epsilon.examples.menu.stocks' },
    { link: 'theming', label: 'epsilon.examples.menu.theming' },
    { link: 'crud', label: 'epsilon.examples.menu.crud' },
    { link: 'form', label: 'epsilon.examples.menu.form' },
    { link: 'notifications', label: 'epsilon.examples.menu.notifications' },
    { link: 'authenticated', label: 'epsilon.examples.menu.auth', auth: true }
  ];

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(
      select(selectAuth),
      map(auth => auth.isAuthenticated)
    );
  }
}
