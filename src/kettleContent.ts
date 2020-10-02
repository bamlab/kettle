import { contentToInclude, replaceIfBlocks, replaceIfLines, replaceValues } from './kettle.replace';
import { PartialKettleOptions } from './kettle.types';

export function kettleContent(input: string, partialOptions?: PartialKettleOptions): string | null {
  let output = input;

  // Exclude
  output = contentToInclude(output, partialOptions);
  if (output === null) return null;

  // Replace IFs
  output = replaceIfBlocks(output, partialOptions);

  output = replaceIfLines(output, partialOptions);

  // Replace values
  output = replaceValues(output, partialOptions);

  return output;
}
