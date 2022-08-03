import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { MediaMatcher } from '@angular/cdk/layout';

import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'sdw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private readonly _mobileQueryListener!: () => void;

  public isLoggedIn: boolean = false;
  public readonly mobileQuery!: MediaQueryList;
  public readonly fillerNav = Array.from(
    { length: 50 },
    (_, i) => `Nav Item ${i + 1}`
  );

  constructor(
    private readonly _cd: ChangeDetectorRef,
    public readonly media: MediaMatcher,
    private readonly keycloak: KeycloakService,
    http: HttpClient
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._cd.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    http.get('api/hello').subscribe(console.log);
  }

  public async ngOnInit(): Promise<void> {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      const userProfile = await this.keycloak.loadUserProfile();
    }
  }

  public login(): void {
    this.keycloak.login();
  }

  public logout(): void {
    this.keycloak.logout();
  }
}
