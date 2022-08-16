import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { pluck } from 'ramda';
import { Socket, Server } from 'socket.io';

import { UserSessionCache } from './user-session-cache';

@WebSocketGateway({ cors: true })
export class UsersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly _server!: Server;

  private readonly _logger: Logger = new Logger(UsersGateway.name);

  constructor(private readonly _userSession: UserSessionCache) {}

  @SubscribeMessage('connectUser')
  public async joinRoom(client: Socket, userName: string): Promise<void> {
    this._logger.log('connectUser', userName);

    client.join('activeUsers');

    this._userSession.addOrUpdate(userName);

    const activeUsers = await this._userSession.getAllActive();
    this._server.emit('activeUsers', pluck('userName', activeUsers));
  }

  public afterInit(server: Server): void {
    this._logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    this._logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket, ...args: unknown[]): void {
    this._logger.log(`Client connected: ${client.id}`);
  }
}
