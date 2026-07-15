import { describe, expect, it } from 'vitest';
import { isValidColor, normalizeColor, parseColor } from '../src/color';

describe('CommonColorPicker color utilities', () => {
  it.each([
    '#123',
    '#1234',
    '#112233',
    '#11223344',
    'rgb(7, 17, 31)',
    'rgba(7, 17, 31, 0.5)',
    'rgb(7 17 31 / 50%)',
    'transparent',
  ])('accepts %s without browser APIs', (color) => {
    expect(isValidColor(color)).toBe(true);
  });

  it.each([
    '#12',
    '#12345',
    'rgb(256, 0, 0)',
    'rgb(0, 0)',
    'rgba(0, 0, 0, 2)',
    'red',
    'var(--brand-color)',
  ])('rejects %s', (color) => {
    expect(isValidColor(color)).toBe(false);
  });

  it('parses alpha hex colors', () => {
    expect(parseColor('#07111F80')).toMatchObject({
      r: 7,
      g: 17,
      b: 31,
      hasAlpha: true,
      source: 'hex',
    });
  });

  it('normalizes colors to the requested format', () => {
    expect(normalizeColor(' #abc ', 'auto')).toBe('#ABC');
    expect(normalizeColor('rgb(7, 17, 31)', 'hex')).toBe('#07111F');
    expect(normalizeColor('#07111F80', 'rgb')).toBe('rgba(7, 17, 31, 0.502)');
    expect(normalizeColor('TRANSPARENT', 'hex')).toBe('transparent');
  });
});
