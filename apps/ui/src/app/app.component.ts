import { ChangeDetectorRef, Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';

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
    public readonly media: MediaMatcher,
    private readonly _translate: TranslateService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._cd.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    _translate.addLangs(['en', 'fr']);
    _translate.setDefaultLang('en');

    const browserLang = _translate.getBrowserLang();
    _translate.use(browserLang?.match(/en|fr/) ? browserLang : 'en');
  }
}
