import { kettleContent } from './kettleContent';
import * as replace from './kettle.replace';

describe('kettleContent', () => {
  it('returns a string', () => {
    expect(kettleContent('')).toBe('');
  });
  it('calls the methods in order', () => {
    // @ts-ignore
    replace.contentToInclude = jest.fn(() => 'output1');
    // @ts-ignore
    replace.replaceIfBlocks = jest.fn(() => 'output2');
    // @ts-ignore
    replace.replaceIfLines = jest.fn(() => 'output3');
    // @ts-ignore
    replace.replaceValues = jest.fn(() => 'output4');

    const result = kettleContent('input');
    expect(replace.contentToInclude).toHaveBeenCalledWith('input', undefined);
    expect(replace.replaceIfBlocks).toHaveBeenCalledWith('output1', undefined);
    expect(replace.replaceIfLines).toHaveBeenCalledWith('output2', undefined);
    expect(replace.replaceValues).toHaveBeenCalledWith('output3', undefined);
    expect(result).toEqual('output4');
  });
});
