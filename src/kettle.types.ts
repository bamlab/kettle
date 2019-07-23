export interface KettleValues {
  [key: string]: string | boolean;
}
export interface KettleOptions {
  namePrefix: string;
  nameSuffix: string;
}

export type PartialKettleOptions = Partial<KettleOptions>;
