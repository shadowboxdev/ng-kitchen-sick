export type GenericFunction = (...args: any[]) => any;
export type GenericClass = Record<string, any>;

export class BoatConstants {
  public static boatjsOptions = 'boatjs/core_options' as const;
}
