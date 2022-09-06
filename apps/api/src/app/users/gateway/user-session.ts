import moment from 'moment';

const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss' as const;

export class UserSession {
  public readonly userName!: string;
  public lastConnectedTime: string;

  constructor(userName: string) {
    this.userName = userName;
    this.lastConnectedTime = moment(new Date()).format(DATE_TIME_FORMAT);
  }

  public isConnected(): boolean {
    const duration = moment.duration(
      moment(new Date()).diff(moment(this.lastConnectedTime, DATE_TIME_FORMAT))
    );
    console.log('duration', duration.asSeconds());
    return duration.asSeconds() < 60;
  }
}
