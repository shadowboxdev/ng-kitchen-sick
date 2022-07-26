import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sdw-dashboard',
  templateUrl: './dashboard.container.html',
  styleUrls: ['./dashboard.container.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardContainer {}
