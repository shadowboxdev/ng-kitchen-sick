import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TranslateModule } from '@ngx-translate/core';
import { KeycloakAngularModule } from 'keycloak-angular';

import { AppComponent } from './app.component';

const MAT_IMPORTS: Type<unknown>[] = [
  LayoutModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatListModule
];

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        KeycloakAngularModule,
        TranslateModule.forRoot(),
        ...MAT_IMPORTS
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
