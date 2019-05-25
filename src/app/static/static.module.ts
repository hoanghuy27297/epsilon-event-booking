import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';

import { StaticRoutingModule } from './static-routing.module';
import { AboutComponent } from './about/about.component';
import { FeaturesComponent } from './features/features.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordDialogComponent } from './profile/change-password-dialog/change-password-dialog.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { StoreModule } from '@ngrx/store';
import { FEATURE_EVENT, reducers } from './manage-users/manage-user.state';
import { ManageUserDialogComponent } from './manage-users/manage-user-dialog/manage-user-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    StaticRoutingModule,
    StoreModule.forFeature(FEATURE_EVENT, reducers)
  ],
  declarations: [
    AboutComponent,
    FeaturesComponent,
    ProfileComponent,
    ChangePasswordDialogComponent,
    ManageUsersComponent,
    ManageUserDialogComponent
  ],
  entryComponents: [ChangePasswordDialogComponent, ManageUserDialogComponent]
})
export class StaticModule {}
