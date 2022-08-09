import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { LayoutModule } from '../layout.module';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let spectator: Spectator<LayoutComponent>;

  const createComponent = createComponentFactory({
    component: LayoutComponent,
    imports: [LayoutModule, NoopAnimationsModule]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render dashboard', () => {
    expect(spectator.fixture).toMatchSnapshot();
  });
});
