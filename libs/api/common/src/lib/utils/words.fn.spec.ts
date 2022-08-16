import { words } from './words.fn';

/**
 * Loosely based on lodash's words function
 * https://lodash.com/docs/4.17.15#words
 */

describe('Utility functions for splitting a string into an array of its words', () => {
  const expected = ['Luke', 'Han', 'Leia', 'Chewy'];

  it('should split a string into an array of its words', () => {
    const string = 'Luke, Han, Leia & Chewy';

    const result = words(string);
    expect(result).toEqual(expected);
  });
});
