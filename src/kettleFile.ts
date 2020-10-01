import { readFile } from 'fs';
import { promisify } from 'util';
import { PartialKettleOptions } from './kettle.types';
import { kettleContent } from './kettleContent';

const promisifiedReadFile = promisify(readFile);

export async function readFileString(path: string): Promise<string> {
  const content = await promisifiedReadFile(path);
  return content.toString();
}

export async function kettleFile(
  filePath: string,
  partialOptions: PartialKettleOptions = {}
): Promise<string> {
  const fileContent = await readFileString(filePath);
  return kettleContent(fileContent, partialOptions);
}
