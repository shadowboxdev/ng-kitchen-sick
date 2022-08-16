import { isNotString } from 'ramda-adjunct';

import { words } from './words.fn';

function capitalize(str: string): string {
  if (isNotString(str)) return '';

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const startCase = (string: string): string =>
  words(`${string}`.replace(/['\u2019]/g, ''))!.reduce(
    (result, word, index) => result + (index ? ' ' : '') + capitalize(word),
    ''
  );
