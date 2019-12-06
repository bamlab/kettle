import { KettleOptions, KettleValues, PartialKettleOptions } from './kettle.types';
import { getOptions } from './utils';
import { replaceValues, stringToInclude } from './kettle.replace';

export function kettlePath(
  inputPath: string,
  partialOptions: PartialKettleOptions = {}
): string | null {
  let output = inputPath;

  // Check includes
  output = stringToInclude(output, partialOptions);
  if (!output) return null;

  // Replace values
  output = replaceValues(output, partialOptions);

  return output;
}
