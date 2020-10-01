import { replaceIfBlocks, replaceIfLines, replaceValues } from './kettle.replace';
import { PartialKettleOptions } from './kettle.types';

export function kettleContent(input: string, partialOptions?: PartialKettleOptions): string {
  let output = input;

  // Replace IFs
  output = replaceIfBlocks(output, partialOptions);

  output = replaceIfLines(output, partialOptions);

  // Replace values
  output = replaceValues(output, partialOptions);

  return output;
}
