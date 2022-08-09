import {
  SpectatorDirective,
  createDirectiveFactory
} from '@ngneat/spectator/jest';

import { LayoutModule } from '../layout.module';
import { OutlinedIconDirective } from './outlined-icon.directive';

describe('OutlinedIconDirective', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let spectator: SpectatorDirective<OutlinedIconDirective>;
  const createDirective = createDirectiveFactory({
    directive: OutlinedIconDirective,
    imports: [LayoutModule]
  });

  beforeEach(() => {
    spectator = createDirective('<mat-icon outlined></mat-icon>');
  });

  it('should add material-icons-outlined css class', () => {
    expect(spectator.element).toHaveClass('material-icons-outlined');
  });
});
