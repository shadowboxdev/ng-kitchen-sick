import { TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardModule } from '../dashboard.module';
import { DashboardContainer } from './dashboard.container';

describe('DashboardContainer', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardContainer],
      imports: [NoopAnimationsModule, DashboardModule]
    }).compileComponents();
  }));

  it('should create component', () => {
    const fixture = TestBed.createComponent(DashboardContainer);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  });
});
