import { Inject, CACHE_MANAGER, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import moment from 'moment';

import { UserSession } from './user-session';

const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss' as const;
const TTL_TIME: number = 60 * 60 * 1000;

@Injectable()
export class UserSessionCache {
  public sessions = null;
  public key = 'userKey';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.sessions = [];
  }

  public async addOrUpdate(userName: string): Promise<void> {
    const allUserSessions = (await this.cacheManager.get(
      this.key
    )) as UserSession[];
    const existingSession = allUserSessions?.find(
      (x) => x.userName === userName
    );

    if (existingSession) {
      existingSession.lastConnectedTime = moment(new Date()).format(
        DATE_TIME_FORMAT
      );
      await this.cacheManager.set(this.key, allUserSessions, {
        ttl: TTL_TIME
      });
    } else {
      this.addNewUserSession(userName, allUserSessions);
    }
  }

  public async get(userName: string): Promise<unknown> {
    const results = await this.cacheManager.get(this.key);
    return results
      ? (results as UserSession[]).find((x) => x.userName === userName)
      : null;
  }

  public async getAllActive(): Promise<UserSession[]> {
    const results = (await this.cacheManager.get(this.key)) as UserSession[];
    return results?.filter((x) => x.isConnected()) ?? [];
  }

  public async remove(userName: string): Promise<void> {
    const results = await this.cacheManager.get(this.key);
    if (results) {
      const updatedSessions = (results as UserSession[]).filter(
        (x) => x.userName !== userName
      );
      await this.cacheManager.set(this.key, updatedSessions, {
        ttl: TTL_TIME
      });
    }
  }

  private async addNewUserSession(
    userName: string,
    allUserSessions: UserSession[]
  ): Promise<void> {
    const allSessions = [...(allUserSessions ?? []), new UserSession(userName)];
    await this.cacheManager.set(this.key, allSessions, {
      ttl: TTL_TIME
    });
  }
}
