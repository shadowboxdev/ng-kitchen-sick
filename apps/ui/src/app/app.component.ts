import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'sdw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean = false;

  constructor(
    private readonly _keycloak: KeycloakService,
    private readonly _http: HttpClient,
    private socket: Socket
  ) {}

  public async ngOnInit(): Promise<void> {
    this.isLoggedIn = await this._keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      const userProfile = await this._keycloak.loadUserProfile();

      this.socket.fromEvent<any>('activeUsers').subscribe(console.log);
      this.socket.emit('connectUser', userProfile.email);

      this._http.get('api/hello').subscribe(console.log);
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
