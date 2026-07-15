import type { CommonColorPickerFormat } from './ColorPicker.types';

export type ParsedColorSource = 'hex' | 'rgb' | 'transparent';

export interface ParsedColor {
  r: number;
  g: number;
  b: number;
  a: number;
  hasAlpha: boolean;
  source: ParsedColorSource;
  hexLength?: 3 | 4 | 6 | 8;
}

const HEX_COLOR_RE = /^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;
const RGB_COLOR_RE = /^(rgba?)\((.*)\)$/i;

function parseHexChannel(value: string): number {
  return Number.parseInt(value.length === 1 ? value.repeat(2) : value, 16);
}

function parseRgbChannel(value: string): number | undefined {
  const channel = value.trim();
  if (!channel) return undefined;

  if (channel.endsWith('%')) {
    const percentage = Number(channel.slice(0, -1));
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) return undefined;
    return Math.round((percentage / 100) * 255);
  }

  const number = Number(channel);
  if (!Number.isFinite(number) || number < 0 || number > 255) return undefined;
  return Math.round(number);
}

function parseAlphaChannel(value: string): number | undefined {
  const channel = value.trim();
  if (!channel) return undefined;

  if (channel.endsWith('%')) {
    const percentage = Number(channel.slice(0, -1));
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) return undefined;
    return percentage / 100;
  }

  const number = Number(channel);
  if (!Number.isFinite(number) || number < 0 || number > 1) return undefined;
  return number;
}

function splitRgbArguments(functionName: string, body: string): string[] | undefined {
  const expectsAlpha = functionName === 'rgba';

  if (body.includes(',')) {
    const argumentsList = body.split(',').map((argument) => argument.trim());
    const expectedLength = expectsAlpha ? 4 : 3;
    return argumentsList.length === expectedLength ? argumentsList : undefined;
  }

  const slashParts = body.split('/').map((part) => part.trim());
  if (slashParts.length > 2) return undefined;

  const hasAlphaSeparator = slashParts.length === 2;
  const colorChannels = slashParts[0].split(/\s+/).filter(Boolean);
  const alphaChannel = slashParts[1];
  if (colorChannels.length !== 3) return undefined;
  if (hasAlphaSeparator && !alphaChannel) return undefined;
  if (expectsAlpha && !hasAlphaSeparator) return undefined;

  return alphaChannel ? [...colorChannels, alphaChannel] : colorChannels;
}

export function parseColor(value: string): ParsedColor | undefined {
  const colorValue = value.trim();
  if (!colorValue) return undefined;

  if (colorValue.toLowerCase() === 'transparent') {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      hasAlpha: true,
      source: 'transparent',
    };
  }

  const hexMatch = colorValue.match(HEX_COLOR_RE);
  if (hexMatch) {
    const hex = hexMatch[1];
    const isShort = hex.length === 3 || hex.length === 4;
    const channelLength = isShort ? 1 : 2;
    const hasAlpha = hex.length === 4 || hex.length === 8;

    return {
      r: parseHexChannel(hex.slice(0, channelLength)),
      g: parseHexChannel(hex.slice(channelLength, channelLength * 2)),
      b: parseHexChannel(hex.slice(channelLength * 2, channelLength * 3)),
      a: hasAlpha ? parseHexChannel(hex.slice(channelLength * 3)) / 255 : 1,
      hasAlpha,
      source: 'hex',
      hexLength: hex.length as 3 | 4 | 6 | 8,
    };
  }

  const rgbMatch = colorValue.match(RGB_COLOR_RE);
  if (!rgbMatch) return undefined;

  const functionName = rgbMatch[1].toLowerCase();
  const argumentsList = splitRgbArguments(functionName, rgbMatch[2]);
  if (!argumentsList) return undefined;

  const red = parseRgbChannel(argumentsList[0]);
  const green = parseRgbChannel(argumentsList[1]);
  const blue = parseRgbChannel(argumentsList[2]);
  const alpha = argumentsList[3] === undefined ? 1 : parseAlphaChannel(argumentsList[3]);
  if (red === undefined || green === undefined || blue === undefined || alpha === undefined) {
    return undefined;
  }

  return {
    r: red,
    g: green,
    b: blue,
    a: alpha,
    hasAlpha: argumentsList[3] !== undefined,
    source: 'rgb',
  };
}

export function isValidColor(value: string): boolean {
  return parseColor(value) !== undefined;
}

function toHexChannel(value: number): string {
  return Math.round(value).toString(16).padStart(2, '0').toUpperCase();
}

function toAlphaText(value: number): string {
  return String(Number(value.toFixed(3)));
}

function normalizeHexColor(color: ParsedColor): string {
  const alpha = color.hasAlpha ? toHexChannel(color.a * 255) : '';
  return `#${toHexChannel(color.r)}${toHexChannel(color.g)}${toHexChannel(color.b)}${alpha}`;
}

function normalizeRgbColor(color: ParsedColor): string {
  if (color.hasAlpha) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${toAlphaText(color.a)})`;
  }
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function normalizeColor(
  value: string,
  format: CommonColorPickerFormat = 'auto',
): string | undefined {
  const color = parseColor(value);
  if (!color) return undefined;
  if (color.source === 'transparent') return 'transparent';

  if (format === 'hex') return normalizeHexColor(color);
  if (format === 'rgb') return normalizeRgbColor(color);

  if (color.source === 'hex') {
    return `#${value.trim().slice(1).toUpperCase()}`;
  }
  return normalizeRgbColor(color);
}
