import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { TranslateModule } from '@ngx-translate/core';
import { KeycloakAngularModule } from 'keycloak-angular';

import { AppComponent } from './app.component';
import { CoreModule } from './core';

const MAT_IMPORTS: Type<unknown>[] = [
  LayoutModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatListModule
];

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      HttpClientTestingModule,
      NoopAnimationsModule,
      RouterTestingModule,
      KeycloakAngularModule,
      TranslateModule.forRoot(),
      CoreModule,
      ...MAT_IMPORTS
    ]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create the app', () => {
    expect(spectator.component).toBeTruthy();
  });
});
