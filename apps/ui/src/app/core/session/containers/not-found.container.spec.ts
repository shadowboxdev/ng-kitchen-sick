import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { SessionModule } from '../session.module';
import { NotFoundContainer } from './not-found.container';

describe('NotFoundContainer', () => {
  let spectator: Spectator<NotFoundContainer>;

  const createComponent = createComponentFactory({
    component: NotFoundContainer,
    imports: [SessionModule]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render dashboard', () => {
    expect(spectator.fixture).toMatchSnapshot();
  });
});
