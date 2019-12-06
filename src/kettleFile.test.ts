import { resolve } from 'path';
import { readFileString, kettleFile } from './kettleFile';

describe('kettle file templating', () => {
  it('templates a .js file', async () => {
    const filePath = resolve('./testFiles/templateFile.input.js');
    const expectedOutput = await readFileString('./testFiles/templateFile.output.js');
    const output = await kettleFile(filePath, {
      values: {
        fName: 'helloWorld',
        isWorld: true,
      },
    });
    expect(output).toEqual(expectedOutput);
  });
  it('templates a .php file', async () => {
    const filePath = resolve('./testFiles/templateFile.input.php');
    const expectedOutput = await readFileString('./testFiles/templateFile.output.php');
    const output = await kettleFile(filePath, {
      values: {
        fName: 'helloWorld',
        isWorld: true,
      },
    });
    expect(output).toEqual(expectedOutput);
  });
  it('templates a .env file', async () => {
    const filePath = resolve('./testFiles/templateFile.input.env');
    const expectedOutput = await readFileString('./testFiles/templateFile.output.env');
    const output = await kettleFile(filePath, {
      values: {
        projectName: 'myProject',
        isDebug: true,
      },
    });
    expect(output).toEqual(expectedOutput);
  });
});
