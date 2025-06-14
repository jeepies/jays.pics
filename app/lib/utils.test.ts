import { cn, templateReplacer, generateInvisibleURL } from './utils';
import { describe, it, expect } from '@jest/globals';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
});

describe('templateReplacer', () => {
  it('replaces templates with values', () => {
    const result = templateReplacer('Hello {{name}}', { name: 'World' });
    expect(result).toBe('Hello World');
  });

  it('keeps template if key missing', () => {
    const result = templateReplacer('Hello {{name}}', {} as any);
    expect(result).toBe('Hello {{name}}');
  });
});

describe('generateInvisibleURL', () => {
  it('inserts url segments correctly', () => {
    const url = 'https://example.com/path';
    const result = generateInvisibleURL(url);
    expect(result.startsWith('https://example.com')).toBe(true);
    expect(result.endsWith(url)).toBe(true);
  });
});