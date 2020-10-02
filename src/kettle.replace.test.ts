import {
  replaceValues,
  replaceIfBlocks,
  stringToInclude,
  replaceIfLines,
  contentToInclude,
} from './kettle.replace';

describe('replaceValues', () => {
  it('replaces a value', () => {
    expect(
      replaceValues('Hello __replace__plop__', {
        values: {
          plop: 'world',
        },
      })
    ).toEqual('Hello world');
  });
  it('replaces two consecutive values', () => {
    expect(
      replaceValues('__replace__value1____replace__value2__!', {
        values: {
          value1: 'hello',
          value2: 'World',
        },
      })
    ).toEqual('helloWorld!');
  });
  it('allows customizing matching pattern', () => {
    expect(
      replaceValues(
        'Hello _rp_plop_',

        {
          values: {
            plop: 'world',
          },
          replacePrefix: '_rp_',
          replaceSuffix: '_',
        }
      )
    ).toEqual('Hello world');
  });
  it('throws an error', () => {
    expect(() =>
      replaceValues('Hello __replace__plop__', {
        values: {
          // @ts-ignore
          plop: 2,
        },
      })
    ).toThrow('[VALUE_IS_NOT_A_STRING] The value of "plop" is not a string');
  });
});

describe('replaceList', () => {
  it('replaces a value', () => {
    expect(replaceValues('helloPlop', { replaceList: [{ from: 'Plop', to: 'World' }] })).toEqual(
      'helloWorld'
    );
  });

  it('replaces multiple values', () => {
    expect(
      replaceValues('plipPlop', {
        replaceList: [
          { from: 'plip', to: 'hello' },
          { from: 'Plop', to: 'World' },
        ],
      })
    ).toEqual('helloWorld');
  });
  it('replaces a same value multiple times', () => {
    expect(
      replaceValues('plipplip', {
        replaceList: [{ from: 'plip', to: 'hello' }],
      })
    ).toEqual('hellohello');
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

    expect(replaceIfBlocks(input, { values: { isWorld: true } })).toEqual(output);
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

    expect(replaceIfBlocks(input, { values: { isWorld: null } })).toEqual(output);
  });
  it('removes falsy Ifs', () => {
    const input = `
    // __if__isWorld__
      helloworld()
    // __endif__
    `;

    const output = `
    `;

    expect(replaceIfBlocks(input, { values: { isWorld: null } })).toEqual(output);
  });
  it('removes falsy Ifs (with !)', () => {
    const input = `
    // __if__!isWorld__
      helloworld()
    // __endif__
    `;

    const output = `
    `;

    expect(replaceIfBlocks(input, { values: { isWorld: true } })).toEqual(output);
  });

  it('allows custom matching patterns', () => {
    const input = `
    // IIisWorldII
      helloworld()
    // EI
    `;

    const output = `
      helloworld()
    `;

    expect(
      replaceIfBlocks(input, {
        values: { isWorld: true },
        ifPrefix: 'II',
        ifSuffix: 'II',
        endif: 'EI',
      })
    ).toEqual(output);
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

    expect(replaceIfLines(input, { values: { isTrue: true } })).toEqual(ouput);
  });
  it('removes paths containing falsy ifs', () => {
    const input = `
      import test1 from '/myApp/truthy__if__isTrue__/test1.js';
      import test2 from '/myApp/plop/truthy__if__isFalse__/test2.js';
    `;

    const output = `
      import test1 from '/myApp/truthy/test1.js';
    `;

    expect(replaceIfLines(input, { values: { isTrue: true, isFalse: false } })).toEqual(output);
  });
  it('allows custom matching patterns', () => {
    const input = `
      import test1 from '/myApp/truthyIIisTrueII/test1.js';
      import test2 from '/myApp/plop/truthyIIisTrueII/test2.js';
    `;

    const output = `
      import test1 from '/myApp/truthy/test1.js';
      import test2 from '/myApp/plop/truthy/test2.js';
    `;

    expect(
      replaceIfLines(input, { values: { isTrue: true }, ifPrefix: 'II', ifSuffix: 'II' })
    ).toEqual(output);
  });
});

describe('stringToInclude', () => {
  it('returns the string without ifs if it has a valid condition', () => {
    expect(stringToInclude('helloWorld__if__value1__', { values: { value1: true } })).toEqual(
      'helloWorld'
    );
  });

  it('returns the string without ifs if it has a valid condition (with !)', () => {
    expect(stringToInclude('helloWorld__if__!value1__', { values: { value1: false } })).toEqual(
      'helloWorld'
    );
  });

  it('returns null if the string has a falsy condition', () => {
    expect(stringToInclude('helloWorld__if__value1__', { values: { value1: false } })).toEqual(
      null
    );
  });

  it('returns null if the string has a falsy condition (with !)', () => {
    expect(stringToInclude('helloWorld__if__!value1__', { values: { value1: true } })).toEqual(
      null
    );
  });

  it('returns true if the string has no condition', () => {
    expect(stringToInclude('helloWorld', { values: { value1: true } })).toEqual('helloWorld');
  });

  it('returns the string without ifs if any condition is true', () => {
    expect(
      stringToInclude('helloWorld__if__value1__/helloSun__if__value2__', {
        values: {
          value1: true,
          value2: false,
        },
      })
    ).toEqual(null);
  });

  it('allows custom matching patterns', () => {
    expect(
      stringToInclude('helloWorldIIvalue1II', {
        values: { value1: true },
        ifPrefix: 'II',
        ifSuffix: 'II',
      })
    ).toEqual('helloWorld');
  });
});

describe('contentToInclude', () => {
  it('returns null if the include condition is false', () => {
    const input = `
    // __include_if__isFalse__
    line 1
    `;

    const output: null = null;

    expect(contentToInclude(input, { values: { isFalse: false } })).toEqual(output);
  });

  it('returns the content without the first line if the include condition is true', () => {
    const input = `
    // __include_if__isTrue__
    line 1
    `;

    const output = `
    line 1
    `;

    expect(contentToInclude(input, { values: { isTrue: true } })).toEqual(output);
  });
});
