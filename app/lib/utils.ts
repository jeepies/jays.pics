import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  let result = "";

  regex.exec(stringWithTemplates)?.forEach((match) => {
    const key = match.replace("{{", "").replace("}}", "");
    const value: string = data[key] ?? "";

    result = stringWithTemplates.replace(match, value);
  });

  return result;
}

export interface DictionaryObject {
  [index: string]: any;
}
