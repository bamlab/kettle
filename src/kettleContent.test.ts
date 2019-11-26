import { kettleContent } from './kettleContent';
import * as replace from './kettle.replace';

describe('kettleContent', () => {
  it('returns a string', () => {
    expect(kettleContent('')).toBe('');
  });
  it('calls the methods in order', () => {
    // @ts-ignore
    replace.replaceIfBlocks = jest.fn(() => 'output1');
    // @ts-ignore
    replace.replaceIfLines = jest.fn(() => 'output2');
    // @ts-ignore
    replace.replaceValues = jest.fn(() => 'output3');

    const result = kettleContent('input');
    expect(replace.replaceIfBlocks).toHaveBeenCalledWith('input', undefined, undefined);
    expect(replace.replaceIfLines).toHaveBeenCalledWith('output1', undefined, undefined);
    expect(replace.replaceValues).toHaveBeenCalledWith('output2', undefined, undefined);
    expect(result).toEqual('output3');
  });
});
