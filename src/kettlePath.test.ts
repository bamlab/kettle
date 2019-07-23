import { kettlePath } from './kettlePath';

describe('kettlePath', () => {
  it('replaces names in path', () => {
    expect(
      kettlePath('/project/src/__replace__appName__/template.js', { appName: 'myApp' })
    ).toEqual('/project/src/myApp/template.js');
  });
});
