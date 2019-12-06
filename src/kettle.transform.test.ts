import { src } from 'gulp';
import { kettleTransformFactory } from './kettle.transform';
import { resolve } from 'path';
import through2 = require('through2');
import * as Vinyl from 'vinyl';

interface TestContent {
  [key: string]: 'file' | 'folder';
}

describe('kettleTransformFactory', () => {
  it('works against a template', jestCallback => {
    const inputPath = resolve(__dirname, '../testFiles/templateInput');
    const content: TestContent = {};

    const contentCollector = through2.obj(
      function(chunk: Vinyl, encoding, callback) {
        const chunkPath = chunk.path.replace(inputPath, '');
        if (chunk.isNull()) content[chunkPath] = 'folder';
        if (chunk.isBuffer()) {
          content[chunkPath] = 'file';
          expect(chunk.contents.toString()).toMatchSnapshot(chunkPath);
        }
        callback();
      },
      function() {
        expect(content).toMatchSnapshot('File architecture');
        jestCallback();
      }
    );

    src([`${inputPath}/**/*`])
      .pipe(
        kettleTransformFactory({
          values: {
            isDebug: false,
            isProd: true,
            isTrue: true,
            isFalse: false,
            utilsName: 'myUtils',
            appName: 'myApp',
          },
        })
      )
      .pipe(contentCollector);
  });
});
