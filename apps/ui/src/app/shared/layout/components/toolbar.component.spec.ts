import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { LayoutModule } from '../layout.module';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let spectator: Spectator<ToolbarComponent>;

  const createComponent = createComponentFactory({
    component: ToolbarComponent,
    imports: [LayoutModule]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render dashboard', () => {
    expect(spectator.fixture).toMatchSnapshot();
  });
});
