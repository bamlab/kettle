import { getStringValue, getOptions } from './utils';
import { KettleValues, PartialKettleOptions } from './kettle.types';
import { replaceIfBlocks, replaceValues, replaceIfLines } from './kettle.replace';

export function kettleContent(
  input: string,
  values?: KettleValues,
  partialOptions?: PartialKettleOptions
): string {
  let output = input;

  // Replace IFs
  output = replaceIfBlocks(output, values, partialOptions);

  output = replaceIfLines(output, values, partialOptions);

  // Replace values
  output = replaceValues(output, values, partialOptions);

  return output;
}
