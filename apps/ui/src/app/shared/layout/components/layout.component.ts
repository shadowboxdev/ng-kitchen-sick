/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/no-host-metadata-property */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';

import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'sdw-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  host: {
    'class.h-full': 'true',
    'class.flex': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  private readonly _mobileQueryListener!: () => void;

  public readonly mobileQuery!: MediaQueryList;
  public readonly fillerNav = Array.from(
    { length: 50 },
    (_, i) => `Nav Item ${i + 1}`
  );

  constructor(
    private readonly _cd: ChangeDetectorRef,
    public readonly media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._cd.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
}
