/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/no-host-metadata-property */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';

import { MediaMatcher } from '@angular/cdk/layout';
import { ConnectedPosition } from '@angular/cdk/overlay';

export interface Section {
  name: string;
  updated: Date;
}

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

  public _positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 20
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom'
    }
  ];

  public folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16')
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16')
    },
    {
      name: 'Work',
      updated: new Date('1/28/16')
    }
  ];
  public notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16')
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16')
    }
  ];

  constructor(
    private readonly _cd: ChangeDetectorRef,
    public readonly media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._cd.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
}
