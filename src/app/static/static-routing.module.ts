import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { FeaturesComponent } from './features/features.component';

const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'epsilon.menu.about' }
  },
  {
    path: 'features',
    component: FeaturesComponent,
    data: { title: 'epsilon.menu.features' }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { title: 'epsition.menu.yourProfile' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule {}
