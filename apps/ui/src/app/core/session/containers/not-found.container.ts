import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sdw-not-found',
  templateUrl: './not-found.container.html',
  styleUrls: ['./not-found.container.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundContainer {}
