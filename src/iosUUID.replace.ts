import * as uuid from 'uuid';

const generatePbxprojUUID = (uuidList: Map<string, string>): string => {
  // Taken from https://github.com/apache/cordova-node-xcode/blob/master/lib/pbxProject.js#L89-L100
  const pbxprojUuid = uuid
    .v4()
    .replace(/-/g, '')
    .substr(0, 24)
    .toUpperCase();

  if (uuidList.has(pbxprojUuid)) return generatePbxprojUUID(uuidList);
  return pbxprojUuid;
};

interface Result {
  uuids: Map<string, string>;
  content: string;
}

export const replaceIosUUIDs = (content: string, uuids?: Map<string, string>): Result => {
  const UUIDs = uuids || new Map<string, string>();
  const ouput = content.replace(/[0-9A-Z]{24}/g, (match: string): string => {
    if (!UUIDs.has(match)) UUIDs.set(match, generatePbxprojUUID(UUIDs));
    return UUIDs.get(match);
  });

  return {
    content: ouput,
    uuids: UUIDs,
  };
};
