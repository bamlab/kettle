import { replaceValues, replaceIfBlocks, stringToInclude, replaceIfLines } from './kettle.replace';

describe('replaceValues', () => {
  it('replaces a value', () => {
    expect(
      replaceValues('Hello __replace__plop__', {
        plop: 'world',
      })
    ).toEqual('Hello world');
  });
  it('replaces two consecutive values', () => {
    expect(
      replaceValues('__replace__value1____replace__value2__!', {
        value1: 'hello',
        value2: 'World',
      })
    ).toEqual('helloWorld!');
  });
  it('allows customizing matching pattern', () => {
    expect(
      replaceValues(
        'Hello _rp_plop_',
        {
          plop: 'world',
        },
        {
          namePrefix: '_rp_',
          nameSuffix: '_',
        }
      )
    ).toEqual('Hello world');
  });
  it('throws an error', () => {
    expect(() =>
      replaceValues('Hello __replace__plop__', {
        // @ts-ignore
        plop: 2,
      })
    ).toThrow('[VALUE_IS_NOT_A_STRING] The value of "plop" is not a string');
  });
});

describe('replaceIfBlocks', () => {
  it('keeps truthy IFs', () => {
    const input = `
    // __if__isWorld__
      helloworld()
    // __endif__
    `;

    const output = `
      helloworld()
    `;

    expect(replaceIfBlocks(input, { isWorld: true })).toEqual(output);
  });
  it('keeps truthy IFs (with !)', () => {
    const input = `
    // __if__!isWorld__
      helloworld()
    // __endif__
    `;

    const output = `
      helloworld()
    `;

    expect(replaceIfBlocks(input, { isWorld: null })).toEqual(output);
  });
  it('removes falsy Ifs', () => {
    const input = `
    // __if__isWorld__
      helloworld()
    // __endif__
    `;

    const output = `
    `;

    expect(replaceIfBlocks(input, { isWorld: null })).toEqual(output);
  });
  it('removes falsy Ifs (with !)', () => {
    const input = `
    // __if__!isWorld__
      helloworld()
    // __endif__
    `;

    const output = `
    `;

    expect(replaceIfBlocks(input, { isWorld: true })).toEqual(output);
  });
});

describe('replaceIfLines', () => {
  it('replaces paths containing ifs', () => {
    const input = `
      import test1 from '/myApp/truthy__if__isTrue__/test1.js';
      import test2 from '/myApp/plop/truthy__if__isTrue__/test2.js';
    `;

    const ouput = `
      import test1 from '/myApp/truthy/test1.js';
      import test2 from '/myApp/plop/truthy/test2.js';
    `;

    expect(replaceIfLines(input, { isTrue: true })).toEqual(ouput);
  });
  it('removes paths containing falsy ifs', () => {
    const input = `
      import test1 from '/myApp/truthy__if__isTrue__/test1.js';
      import test2 from '/myApp/plop/truthy__if__isFalse__/test2.js';
    `;

    const ouput = `
      import test1 from '/myApp/truthy/test1.js';
    `;

    expect(replaceIfLines(input, { isTrue: true, isFalse: false })).toEqual(ouput);
  });
});

describe('stringToInclude', () => {
  it('returns the string without ifs if it has a valid condition', () => {
    expect(stringToInclude('helloWorld__if__value1__', { value1: true })).toEqual('helloWorld');
  });

  it('returns the string without ifs if it has a valid condition (with !)', () => {
    expect(stringToInclude('helloWorld__if__!value1__', { value1: false })).toEqual('helloWorld');
  });

  it('returns null if the string has a falsy condition', () => {
    expect(stringToInclude('helloWorld__if__value1__', { value1: false })).toEqual(null);
  });

  it('returns null if the string has a falsy condition (with !)', () => {
    expect(stringToInclude('helloWorld__if__!value1__', { value1: true })).toEqual(null);
  });

  it('returns true if the string has no condition', () => {
    expect(stringToInclude('helloWorld', { value1: true })).toEqual('helloWorld');
  });

  it('returns the string without ifs if any condition is true', () => {
    expect(
      stringToInclude('helloWorld__if__value1__/helloSun__if__value2__', {
        value1: true,
        value2: false,
      })
    ).toEqual(null);
  });
});
