import { readFileSync } from 'fs';

export const gitignoreToGlob = (gitignorePath: string): Array<string> => {
  const res: Array<string> = [];

  readFileSync(gitignorePath)
    .toString()
    .split('\n')
    .filter(line => !!line && !line.match(/^#/))
    .forEach(_line => {
      let line = _line;

      // Handle negatives
      const isNegative = !!line.match(/^\!/);
      if (isNegative) line = line.replace(/^\!/, '');

      // Handle starting path
      if (line.match(/^\//)) {
        line = line.replace(/^\//, '');
      } else {
        line = `**/${line}`;
      }

      // Handle folders
      if (line.match(/\/$/)) {
        res.push(isNegative ? `${line}**/*` : `!${line}**/*`);
      }
      // Handle unknown
      else {
        res.push(isNegative ? `${line}` : `!${line}`);
        res.push(isNegative ? `${line}/**/*` : `!${line}/**/*`);
      }
    });

  return res;
};
