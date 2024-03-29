import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { DashboardModule } from '../dashboard.module';
import { DashboardContainer } from './dashboard.container';

describe('DashboardContainer', () => {
  let spectator: Spectator<DashboardContainer>;

  const createComponent = createComponentFactory({
    component: DashboardContainer,
    imports: [DashboardModule]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render dashboard', () => {
    expect(spectator.fixture).toMatchSnapshot();
  });
});
