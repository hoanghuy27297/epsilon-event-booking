import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { FeaturesComponent } from './features/features.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

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
    data: { title: 'epsilon.menu.yourProfile' }
  },
  {
    path: 'manage-user',
    component: ManageUsersComponent,
    data: { title: 'epsilon.menu.manageUser' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule {}
