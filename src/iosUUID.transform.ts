import * as through from 'through2';
import { Transform } from 'stream';
import * as PluginError from 'plugin-error';
import * as Vinyl from 'vinyl';
import { replaceIosUUIDs } from './iosUUID.replace';

const PLUGIN_NAME = 'gulp-pbxprojUUIDs';
/**
 * Outputs a node Transform object usable in Gulp
 */
export const iosUUIDsTransformFactory = () => {
  // Persist uuids accross files
  let _uuids: Map<string, string>;

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
    const path = chunk.path;

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

    const { content, uuids } = replaceIosUUIDs(chunk.contents.toString(), _uuids);
    _uuids = uuids;

    if (chunk.isBuffer()) {
      const output = new Vinyl({
        cwd: chunk.cwd,
        base: chunk.base,
        path,
        contents: Buffer.from(content),
      });
      return callback(null, output);
    }
  });
};
