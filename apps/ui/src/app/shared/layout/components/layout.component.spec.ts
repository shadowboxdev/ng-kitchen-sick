import { TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutModule } from '../layout.module';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      imports: [NoopAnimationsModule, LayoutModule]
    }).compileComponents();
  }));

  it('should create component', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  });
});
