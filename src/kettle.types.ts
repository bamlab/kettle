export interface KettleValues {
  [key: string]: string | boolean;
}
export interface KettleOptions {
  /**
   * When replacing, transformer will iterate through all these
   * items, replacing each occurence of a `from` to the `to`
   */
  replaceList: Array<{ from: string; to: string }>;
  /**
   * Used to find the value when detecting a replaceBlock or a ifBlock
   */
  values: KettleValues;
  replacePrefix: string;
  replaceSuffix: string;
  ifPrefix: string;
  includeIfPrefix: string;
  ifSuffix: string;
  endif: string;
}

export type PartialKettleOptions = Partial<KettleOptions>;
