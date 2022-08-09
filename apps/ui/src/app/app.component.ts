import { Component, OnInit } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'sdw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean = false;

  constructor(private readonly _keycloak: KeycloakService) {}

  public async ngOnInit(): Promise<void> {
    this.isLoggedIn = await this._keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      const userProfile = await this._keycloak.loadUserProfile();
      console.log(userProfile);
    }
  }

  public login(): void {
    this._keycloak.login();
  }

  public logout(): void {
    this._keycloak.logout();
  }
}
