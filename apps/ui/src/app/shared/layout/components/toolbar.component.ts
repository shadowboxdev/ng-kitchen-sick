import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Optional
} from '@angular/core';

import { ConnectedPosition } from '@angular/cdk/overlay';

import { LayoutContainer } from '../models';
import { LAYOUT_CONTAINER } from '../providers';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'sdw-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
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

  constructor(
    @Optional()
    @Inject(LAYOUT_CONTAINER)
    private readonly _container: LayoutContainer | null
  ) {}

  public onToggleSidenav(): void {
    this._container?.toggleSideNav();
  }
}
