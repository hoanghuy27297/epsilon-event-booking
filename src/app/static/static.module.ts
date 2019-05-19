import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';

import { StaticRoutingModule } from './static-routing.module';
import { AboutComponent } from './about/about.component';
import { FeaturesComponent } from './features/features.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordDialogComponent } from './profile/change-password-dialog/change-password-dialog.component';

@NgModule({
  imports: [SharedModule, StaticRoutingModule],
  declarations: [AboutComponent, FeaturesComponent, ProfileComponent, ChangePasswordDialogComponent],
  entryComponents: [
    ChangePasswordDialogComponent
  ],
})
export class StaticModule {}
