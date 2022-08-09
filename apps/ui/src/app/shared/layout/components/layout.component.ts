/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/no-host-metadata-property */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild
} from '@angular/core';

import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

import { LayoutContainer } from '../models';
import { LAYOUT_CONTAINER } from '../providers';

@Component({
  selector: 'sdw-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  host: {
    'class.h-full': 'true',
    'class.flex': 'true'
  },
  viewProviders: [
    {
      provide: LAYOUT_CONTAINER,
      useExisting: LayoutComponent
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements LayoutContainer {
  private readonly _mobileQueryListener!: () => void;

  @ViewChild(MatSidenav, { static: true })
  private readonly _sideNav!: MatSidenav;

  public readonly mobileQuery!: MediaQueryList;

  constructor(
    private readonly _cd: ChangeDetectorRef,
    public readonly media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._cd.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  public toggleSideNav(): void {
    this._sideNav.toggle();
  }
}
