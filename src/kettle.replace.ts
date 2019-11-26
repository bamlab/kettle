import { KettleValues, KettleOptions, PartialKettleOptions } from './kettle.types';
import { getStringValue, getOptions } from './utils';

/**
 * Replace a if block with its content
 * - Start with `__if__myValue__` or `__if__!myValue__`
 * - End with `__endif`
 */
export function replaceIfBlocks(
  input: string,
  values: KettleValues,
  partialOptions: PartialKettleOptions = {}
) {
  const options = getOptions(partialOptions);
  const ifStartLineRegex = `[\\t ]*?(?:\\/\\/|#) ${options.ifPrefix}([^_]+)${options.ifSuffix}[\\n\\r]`;
  const ifContentLinesRegex = '([^]*?)';
  const ifEndLineRegex = `[\\t ]*?(?:\\/\\/|#) ${options.endif}[\\n\\r]`;
  const ifRegex = new RegExp(`${ifStartLineRegex}${ifContentLinesRegex}${ifEndLineRegex}`, 'gm');
  return input.replace(ifRegex, (_match, ifValueKey, content) => {
    if (
      (!ifValueKey.startsWith('!') && !!values[ifValueKey]) ||
      (ifValueKey.startsWith('!') && !values[ifValueKey.substr(1)])
    )
      return content;
    return '';
  });
}

/**
 * Replace a line containing `__if__myValue__` or `__if__!myValue__`
 * If the value is false, the line
 */
export function replaceIfLines(
  input: string,
  values: KettleValues,
  partialOptions: PartialKettleOptions = {}
) {
  const options = getOptions(partialOptions);
  const ifPathRegex = new RegExp(`(.*?${options.ifPrefix}!?\\w+?${options.ifSuffix}.*?)\\n`, 'g');
  return input.replace(ifPathRegex, (match: string, substring: string): string => {
    const replacement = stringToInclude(substring, values, partialOptions);
    return !!replacement ? `${replacement}\n` : '';
  });
}

/**
 * Replaces `__replace__myValue__` with the value
 */
export function replaceValues(
  input: string,
  values: KettleValues = {},
  partialOptions: PartialKettleOptions = {}
) {
  const options = getOptions(partialOptions);
  const nameRegexp = new RegExp(`${options.replacePrefix}(\\w+?)${options.replaceSuffix}`, 'g');
  return input.replace(nameRegexp, (_match, valueKey) => {
    return getStringValue(values, valueKey);
  });
}

/**
 * Checks the __if__var__ of a string against the values
 * - If values are falsy returns null
 * - If values are truthy returns the string without the __if__var__
 */
export function stringToInclude(
  input: string,
  values: KettleValues,
  partialOptions: PartialKettleOptions = {}
): string | null {
  const options = getOptions(partialOptions);
  const includeRegex = new RegExp(`^(.*?)${options.ifPrefix}(!?\\w+?)${options.ifSuffix}(.*)$`);
  const match = input.match(includeRegex);

  if (!match) return input;

  const [matchChars, prefix, valueKey, suffix] = match;

  if (
    (!valueKey.startsWith('!') && !values[valueKey]) ||
    (valueKey.startsWith('!') && values[valueKey.substr(1)])
  )
    return null;

  return stringToInclude(`${prefix}${suffix}`, values, partialOptions);
}
