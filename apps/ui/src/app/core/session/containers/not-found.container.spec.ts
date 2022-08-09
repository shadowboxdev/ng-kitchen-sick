import { TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SessionModule } from '../session.module';
import { NotFoundContainer } from './not-found.container';

describe('NotFoundContainer', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NotFoundContainer],
      imports: [NoopAnimationsModule, SessionModule]
    }).compileComponents();
  }));

  it('should create component', () => {
    const fixture = TestBed.createComponent(NotFoundContainer);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  });
});
