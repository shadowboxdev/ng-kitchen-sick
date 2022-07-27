import { async, TestBed } from '@angular/core/testing';

import { DashboardContainer } from './dashboard.container';

describe('DashboardContainer', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardContainer]
    }).compileComponents();
  }));

  it('should create component', () => {
    const fixture = TestBed.createComponent(DashboardContainer);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  });
});
