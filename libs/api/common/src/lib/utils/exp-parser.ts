export class ExpParser {
  private parsedExp: any[];

  constructor(private exp: string) {
    this.parsedExp = [];
  }

  public static from(exp: string): ExpParser {
    const parser = new ExpParser(exp);
    parser._handle();

    return parser;
  }

  public toObj(): Record<string, any> {
    const obj: any = {};
    for (const o of this.parsedExp) {
      obj[o.name] = o.args;
    }

    return obj;
  }

  public toArr(): Array<Record<string, any>> {
    return this.parsedExp;
  }

  private _handle(): this {
    let o: any = {};
    let p = [];
    let inArray = false;
    const presenter = [];

    const length = this.exp.length;
    let i = 0;
    while (i < length) {
      const lastChar = this.exp.charCodeAt(i - 1);
      const ch = this.exp.charCodeAt(i);
      if (ch === 91) {
        o['name'] = p.join('');
        o['args'] = [];
        p = [];
        inArray = true;
      } else if (inArray && ch === 44) {
        o['args'].push(p.join(''));
        p = [];
      } else if (ch === 93) {
        o['args'].push(p.join(''));
        presenter.push(o);
        o = {};
        p = [];
        inArray = false;
      } else if (lastChar !== 93 && ch === 44) {
        o['name'] = p.join('');
        presenter.push(o);
        o = {};
        p = [];
      } else if (ch !== 93 && length - i === 1) {
        p.push(String.fromCharCode(ch));
        o['name'] = p.join('');
        presenter.push(o);
      } else if (ch !== 44) {
        p.push(String.fromCharCode(ch));
      }

      i++;
    }

    this.parsedExp = presenter;

    return this;
  }
}
