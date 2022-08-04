import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { LayoutModule as CdkLayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';
import {
  faGithub,
  faMediumM,
  faTwitter,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import {
  faCog,
  faBars,
  faRocket,
  faPowerOff,
  faUserCircle,
  faPlayCircle
} from '@fortawesome/free-solid-svg-icons';

import { LayoutComponent } from './components/layout.component';

const NG_IMPORTS: Type<unknown>[] = [CommonModule];

const MAT_IMPORTS: Type<unknown>[] = [
  CdkLayoutModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatListModule
];

const OTHER_IMPORTS: Type<unknown>[] = [FontAwesomeModule];

const DECLARATIONS: Type<unknown>[] = [LayoutComponent];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...NG_IMPORTS, ...MAT_IMPORTS, ...OTHER_IMPORTS],
  exports: [...DECLARATIONS],
  providers: []
})
export class LayoutModule {
  constructor(private readonly _faIconLibrary: FaIconLibrary) {
    this._addFaIcons();
  }

  private _addFaIcons(): void {
    this._faIconLibrary.addIcons(
      faCog,
      faBars,
      faRocket,
      faPowerOff,
      faUserCircle,
      faPlayCircle,
      faGithub,
      faMediumM,
      faTwitter,
      faInstagram,
      faYoutube
    );
  }
}
