import { KettleOptions, KettleValues, PartialKettleOptions } from './kettle.types';
import { getOptions } from './utils';
import { replaceValues, stringToInclude } from './kettle.replace';

export function kettlePath(
  inputPath: string,
  values: KettleValues = {},
  partialOptions: PartialKettleOptions = {}
): string | null {
  let output = inputPath;

  // Check includes
  output = stringToInclude(output, values);
  if (!output) return null;

  // Replace values
  output = replaceValues(output, values, partialOptions);

  return output;
}
