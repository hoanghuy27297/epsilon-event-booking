import { HttpClient } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';

import { AuthEffects } from './auth.effects';
import { AuthGuardService } from './auth-guard.service';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { HttpLoaderFactory } from '../core.module';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    SharedModule,
    AuthRoutingModule,

    EffectsModule.forFeature([
      AuthEffects
    ]),

    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  providers: [AuthGuardService]
})

export class AuthModule { }
