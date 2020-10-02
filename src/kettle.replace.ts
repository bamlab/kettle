import { PartialKettleOptions } from './kettle.types';
import { getOptions, getStringValue } from './utils';

const COMMENT_REGEX_STRING = '[\\t ]*?(?:\\/\\/|#) ';

/**
 * Exclude file if it finds a false include condition:
 * - Start with `__include_if__myValue__` or `__include_if__!myValue__`
 */
export function contentToInclude(
  input: string,
  partialOptions: PartialKettleOptions = {}
): string | null {
  const options = getOptions(partialOptions);
  const includeRegex = new RegExp(
    `${COMMENT_REGEX_STRING}${options.includeIfPrefix}(!?\\w+?)${options.ifSuffix}.*?\\n`
  );

  const match = input.match(includeRegex);

  if (!match) return input;

  const [matchChars, valueKey] = match;

  if (
    (!valueKey.startsWith('!') && !options.values[valueKey]) ||
    (valueKey.startsWith('!') && options.values[valueKey.substr(1)])
  )
    return null;

  return input.replace(matchChars, '');
}

/**
 * Replace a if block with its content
 * - Start with `__if__myValue__` or `__if__!myValue__`
 * - End with `__endif`
 */
export function replaceIfBlocks(input: string, partialOptions: PartialKettleOptions = {}) {
  const options = getOptions(partialOptions);
  const ifStartLineRegex = `${COMMENT_REGEX_STRING}${options.ifPrefix}([^_]+)${options.ifSuffix}[\\n\\r]`;
  const ifContentLinesRegex = '([^]*?)';
  const ifEndLineRegex = `${COMMENT_REGEX_STRING}${options.endif}[\\n\\r]`;
  const ifRegex = new RegExp(`${ifStartLineRegex}${ifContentLinesRegex}${ifEndLineRegex}`, 'gm');
  return input.replace(ifRegex, (_match, ifValueKey, content) => {
    if (
      (!ifValueKey.startsWith('!') && !!options.values[ifValueKey]) ||
      (ifValueKey.startsWith('!') && !options.values[ifValueKey.substr(1)])
    )
      return content;
    return '';
  });
}

/**
 * Replace a line containing `__if__myValue__` or `__if__!myValue__`
 * If the value is false, the lines are removed
 */
export function replaceIfLines(input: string, partialOptions: PartialKettleOptions = {}) {
  const options = getOptions(partialOptions);
  const ifPathRegex = new RegExp(`(.*?${options.ifPrefix}!?\\w+?${options.ifSuffix}.*?)\\n`, 'g');
  return input.replace(ifPathRegex, (match: string, substring: string): string => {
    const replacement = stringToInclude(substring, partialOptions);
    return !!replacement ? `${replacement}\n` : '';
  });
}

/**
 * Replaces `__replace__myValue__` with the value
 */
export function replaceValues(input: string, partialOptions: PartialKettleOptions = {}) {
  const options = getOptions(partialOptions);

  const nameRegexp = new RegExp(`${options.replacePrefix}(\\w+?)${options.replaceSuffix}`, 'g');
  let output = input.replace(nameRegexp, (_match, valueKey) => {
    return getStringValue(options.values, valueKey);
  });

  for (let replaceItem of options.replaceList) {
    output = output.replace(new RegExp(replaceItem.from, 'g'), replaceItem.to);
  }

  return output;
}

/**
 * Checks the __if__var__ of a string against the values
 * - If values are falsy returns null
 * - If values are truthy returns the string without the __if__var__
 */
export function stringToInclude(
  input: string,
  partialOptions: PartialKettleOptions = {}
): string | null {
  const options = getOptions(partialOptions);
  const includeRegex = new RegExp(`^(.*?)${options.ifPrefix}(!?\\w+?)${options.ifSuffix}(.*)$`);
  const match = input.match(includeRegex);

  if (!match) return input;

  const [matchChars, prefix, valueKey, suffix] = match;

  if (
    (!valueKey.startsWith('!') && !options.values[valueKey]) ||
    (valueKey.startsWith('!') && options.values[valueKey.substr(1)])
  )
    return null;

  return stringToInclude(`${prefix}${suffix}`, partialOptions);
}
