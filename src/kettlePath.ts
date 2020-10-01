import { replaceValues, stringToInclude } from './kettle.replace';
import { PartialKettleOptions } from './kettle.types';

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
