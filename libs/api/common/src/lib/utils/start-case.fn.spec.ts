import { startCase } from './start-case.fn';

/**
 * Loosely based on lodash's startCase function
 * https://lodash.com/docs/4.17.15#startCase
 */

describe('Utility functions for converting to start case', () => {
  const expected = 'Foo Bar';

  it('should parse lower case letters and hyphens correctly', () => {
    const string = '--foo-bar--';

    const result = startCase(string);
    expect(result).toBe(expected);
  });

  it('should parse camel case strings correctly', () => {
    const string = 'fooBar';

    const result = startCase(string);
    expect(result).toBe(expected);
  });

  it('should parse underscores and capital letters correctly', () => {
    const string = '__Foo_Bar__';

    const result = startCase(string);
    expect(result).toBe(expected);
  });
});
