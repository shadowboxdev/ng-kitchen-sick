import { strings } from '@angular-devkit/core';

const { dasherize, capitalize } = strings;

export function titlize(name: string) {
  return capitalize(
    dasherize(capitalize(name))
      .split('-')
      .join(' ')
  );
}
