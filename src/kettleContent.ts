import { getStringValue, getOptions } from './utils';
import { KettleValues, PartialKettleOptions } from './kettle.types';
import { replaceIfBlocks, replaceValues, replaceIfLines } from './kettle.replace';

export function kettleContent(input: string, partialOptions?: PartialKettleOptions): string {
  let output = input;

  // Replace IFs
  output = replaceIfBlocks(output, partialOptions);

  output = replaceIfLines(output, partialOptions);

  // Replace values
  output = replaceValues(output, partialOptions);

  return output;
}
