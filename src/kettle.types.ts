export interface KettleValues {
  [key: string]: string | boolean;
}
export interface KettleOptions {
  replacePrefix: string;
  replaceSuffix: string;
  ifPrefix: string;
  ifSuffix: string;
  endif: string;
}

export type PartialKettleOptions = Partial<KettleOptions>;
