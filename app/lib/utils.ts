import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { string } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Replace all {{templates}} with values with value from the data object
 * @param stringWithTemplates
 * @param data
 * @returns {string}
 */
export function templateReplacer(
  stringWithTemplates: string,
  data: DictionaryObject
) {
  const regex = /(?:{{[a-z_.]+}})/gi;

  const matches = [...stringWithTemplates.matchAll(regex)];

  matches.forEach((match) => {
    const s_match = match.toString();
    const key = s_match.replace("{{", "").replace("}}", "");
    const value: string = data[key];

    stringWithTemplates = stringWithTemplates.replace(s_match, (value === "" || value === undefined) ? s_match : value);
  });

  return stringWithTemplates
}

export interface DictionaryObject {
  [index: string]: any;
}
