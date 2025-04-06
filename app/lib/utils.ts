import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Replace all {{templates}} with values with value from the data object
 * @param stringWithTemplates
 * @param data
 * @returns {string}
 */
export function templateReplacer(stringWithTemplates: string, data: DictionaryObject) {
  const regex = /(?:{{[a-z_.]+}})/gi;

  const matches = [...stringWithTemplates.matchAll(regex)];

  matches.forEach((match) => {
    const s_match = match.toString();
    const key = s_match.replace('{{', '').replace('}}', '');
    const value: string = data[key];

    stringWithTemplates = stringWithTemplates.replace(s_match, value === '' || value === undefined ? s_match : value);
  });

  return stringWithTemplates;
}

export function generateInvisibleURL(url: string) {
  const template = `[URL-1] ||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| [URL-2]`;
  const _url = new URL(url);
  const segment = _url.protocol + '//' + _url.host;
  return template.replace('[URL-1]', segment).replace('[URL-2]', url);
}

export interface DictionaryObject {
  [index: string]: any;
}
