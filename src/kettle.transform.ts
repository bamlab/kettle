import * as through from 'through2';
import { Transform } from 'stream';
import * as PluginError from 'plugin-error';
import * as Vinyl from 'vinyl';
import { kettleContent } from './kettleContent';
import { KettleValues, PartialKettleOptions } from './kettle.types';
import { kettlePath } from './kettlePath';

const PLUGIN_NAME = 'gulp-kettle';
/**
 * Outputs a node Transform object usable in Gulp
 */
export const kettleTransformFactory = (values: KettleValues, options?: PartialKettleOptions) => {
  /**
   * Do not use arrow function with through
   * as through defines this as Transform
   */
  return through.obj(function(
    this: Transform,
    chunk: Vinyl,
    encoding: string,
    callback: (error: Error | null, chunk?: Vinyl) => void
  ) {
    const path = kettlePath(chunk.path, values, options);

    if (!path) return callback(null);

    if (chunk.isNull()) {
      const output = new Vinyl({
        cwd: chunk.cwd,
        base: chunk.base,
        path,
      });
      return callback(null, output);
    }

    if (chunk.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
    }

    if (chunk.isBuffer()) {
      const output = new Vinyl({
        cwd: chunk.cwd,
        base: chunk.base,
        path,
        contents: Buffer.from(kettleContent(chunk.contents.toString(), values, options)),
      });
      return callback(null, output);
    }
  });
};
