import { replaceIosUUIDs } from './iosUUID.replace';
import * as uuid from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('replaceUUIDs', () => {
  it('replaces a single UUID', () => {
    (uuid.v4 as jest.Mock).mockReturnValueOnce('cbe356a3-cd7a-4d43-9957-a4833db4dd79'); //CBE356A3CD7A4D439957A483
    const input = '00E356F31AD99517003FC87E';
    expect(replaceIosUUIDs(input)).toEqual({
      content: 'CBE356A3CD7A4D439957A483',
      uuids: new Map([['00E356F31AD99517003FC87E', 'CBE356A3CD7A4D439957A483']]),
    });
  });

  it('replaces multiple UUIDs', () => {
    (uuid.v4 as jest.Mock)
      .mockReturnValueOnce('cbe356a3-cd7a-4d43-9957-a4833db4dd79') //CBE356A3CD7A4D439957A483
      .mockReturnValueOnce('33bccc7a-bb11-4d57-9185-759c3e1f9d56'); //33BCCC7ABB114D579185759C

    const input = `
      00E356F31AD99517003FC87E
      20E356F31AD99517003FC87E = "This is a test"
    `;
    const ouput = {
      content: `
      CBE356A3CD7A4D439957A483
      33BCCC7ABB114D579185759C = "This is a test"
    `,
      uuids: new Map([
        ['00E356F31AD99517003FC87E', 'CBE356A3CD7A4D439957A483'],
        ['20E356F31AD99517003FC87E', '33BCCC7ABB114D579185759C'],
      ]),
    };

    expect(replaceIosUUIDs(input)).toEqual(ouput);
  });

  it('replaces the same UUID', () => {
    (uuid.v4 as jest.Mock).mockReturnValueOnce('cbe356a3-cd7a-4d43-9957-a4833db4dd79'); //CBE356A3CD7A4D439957A483

    const input = `
      00E356F31AD99517003FC87E
      00E356F31AD99517003FC87E
    `;
    const ouput = {
      content: `
      CBE356A3CD7A4D439957A483
      CBE356A3CD7A4D439957A483
    `,
      uuids: new Map([['00E356F31AD99517003FC87E', 'CBE356A3CD7A4D439957A483']]),
    };

    expect(replaceIosUUIDs(input)).toEqual(ouput);
  });
});
