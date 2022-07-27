import { ChangeDetectorRef, Component } from '@angular/core';

import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'sdw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly _mobileQueryListener!: () => void;

  public readonly mobileQuery!: MediaQueryList;
  public readonly fillerNav = Array.from(
    { length: 50 },
    (_, i) => `Nav Item ${i + 1}`
  );

  constructor(
    private readonly _cd: ChangeDetectorRef,
    public readonly media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._cd.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
}
