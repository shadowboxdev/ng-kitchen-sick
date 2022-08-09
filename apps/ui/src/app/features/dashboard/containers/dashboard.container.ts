import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatFabMenu } from '@angular-material-extensions/fab-menu';

@Component({
  selector: 'sdw-dashboard',
  templateUrl: './dashboard.container.html',
  styleUrls: ['./dashboard.container.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardContainer {
  public readonly fabButtonsRandom: MatFabMenu[] = [
    {
      id: 1,
      icon: 'create'
    },
    {
      id: 2,
      icon: 'mail'
    },
    {
      id: 3,
      icon: 'file_copy'
    },
    {
      id: 4,
      icon: 'phone'
    }
  ];
}
